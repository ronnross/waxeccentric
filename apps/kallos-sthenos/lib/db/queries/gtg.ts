import { getDb } from "@/lib/db";
import type { CreateGtgProgram } from "@/lib/schemas/gtg";

interface GtgProgramRow {
  id: number;
  exercise_id: number;
  daily_goal: number;
  reps_per_set: number;
  start_date: string;
  end_date: string;
  active: number;
  created_at: string;
}

interface GtgLogRow {
  id: number;
  program_id: number;
  date: string;
  logged_at: string;
}

export interface GtgProgramWithProgress {
  id: number;
  exercise_id: number;
  exercise_name: string;
  daily_goal: number;
  reps_per_set: number;
  start_date: string;
  end_date: string;
  active: boolean;
  sets_today: number;
  reps_today: number;
  created_at: string;
}

export function getActiveProgram(date: string): GtgProgramWithProgress | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT p.*, e.name AS exercise_name
       FROM gtg_programs p
       JOIN exercises e ON e.id = p.exercise_id
       WHERE p.active = 1 AND p.start_date <= ? AND p.end_date >= ?
       ORDER BY p.created_at DESC
       LIMIT 1`,
    )
    .get(date, date) as (GtgProgramRow & { exercise_name: string }) | undefined;

  if (!row) return null;

  const sets = db
    .prepare(
      "SELECT COUNT(*) AS cnt FROM gtg_logs WHERE program_id = ? AND date = ?",
    )
    .get(row.id, date) as { cnt: number };

  return {
    id: row.id,
    exercise_id: row.exercise_id,
    exercise_name: row.exercise_name,
    daily_goal: row.daily_goal,
    reps_per_set: row.reps_per_set,
    start_date: row.start_date,
    end_date: row.end_date,
    active: row.active === 1,
    sets_today: sets.cnt,
    reps_today: sets.cnt * row.reps_per_set,
    created_at: row.created_at,
  };
}

export function getProgram(id: number): GtgProgramRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM gtg_programs WHERE id = ?").get(id) as
    | GtgProgramRow
    | undefined;
}

export function createProgram(data: CreateGtgProgram): GtgProgramWithProgress {
  const db = getDb();

  // Deactivate any currently active programs
  db.prepare("UPDATE gtg_programs SET active = 0 WHERE active = 1").run();

  const result = db
    .prepare(
      `INSERT INTO gtg_programs (exercise_id, daily_goal, reps_per_set, start_date, end_date)
       VALUES (@exercise_id, @daily_goal, @reps_per_set, @start_date, @end_date)`,
    )
    .run({
      exercise_id: data.exercise_id,
      daily_goal: data.daily_goal,
      reps_per_set: data.reps_per_set,
      start_date: data.start_date,
      end_date: data.end_date,
    });

  return getActiveProgram(data.start_date)!;
}

export function logSet(
  programId: number,
  date: string,
): { sets_today: number; reps_today: number } {
  const db = getDb();
  const program = db
    .prepare("SELECT * FROM gtg_programs WHERE id = ?")
    .get(programId) as GtgProgramRow | undefined;

  if (!program) throw new Error("Program not found");

  db.prepare("INSERT INTO gtg_logs (program_id, date) VALUES (?, ?)").run(
    programId,
    date,
  );

  const sets = db
    .prepare(
      "SELECT COUNT(*) AS cnt FROM gtg_logs WHERE program_id = ? AND date = ?",
    )
    .get(programId, date) as { cnt: number };

  return {
    sets_today: sets.cnt,
    reps_today: sets.cnt * program.reps_per_set,
  };
}

export function undoLastSet(
  programId: number,
  date: string,
): { sets_today: number; reps_today: number } {
  const db = getDb();
  const program = db
    .prepare("SELECT * FROM gtg_programs WHERE id = ?")
    .get(programId) as GtgProgramRow | undefined;

  if (!program) throw new Error("Program not found");

  // Delete the most recent log entry for this program+date
  db.prepare(
    `DELETE FROM gtg_logs WHERE id = (
       SELECT id FROM gtg_logs WHERE program_id = ? AND date = ? ORDER BY logged_at DESC LIMIT 1
     )`,
  ).run(programId, date);

  const sets = db
    .prepare(
      "SELECT COUNT(*) AS cnt FROM gtg_logs WHERE program_id = ? AND date = ?",
    )
    .get(programId, date) as { cnt: number };

  return {
    sets_today: sets.cnt,
    reps_today: sets.cnt * program.reps_per_set,
  };
}

export function deactivateProgram(id: number): boolean {
  const db = getDb();
  const result = db
    .prepare("UPDATE gtg_programs SET active = 0 WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

export function getWeekHistory(
  programId: number,
  fromDate: string,
  toDate: string,
) {
  const db = getDb();
  const program = db
    .prepare("SELECT * FROM gtg_programs WHERE id = ?")
    .get(programId) as GtgProgramRow | undefined;

  if (!program) return [];

  const rows = db
    .prepare(
      `SELECT date, COUNT(*) AS sets_count
       FROM gtg_logs
       WHERE program_id = ? AND date >= ? AND date <= ?
       GROUP BY date
       ORDER BY date`,
    )
    .all(programId, fromDate, toDate) as { date: string; sets_count: number }[];

  return rows.map((r) => ({
    date: r.date,
    sets: r.sets_count,
    reps: r.sets_count * program.reps_per_set,
    goal: program.daily_goal,
  }));
}
