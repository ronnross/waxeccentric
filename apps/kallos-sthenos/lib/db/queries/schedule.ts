import { getDb } from "@/lib/db";
import type { RoutineDetail } from "@/lib/schemas/routine";
import type {
  CreateSchedule,
  ScheduledRoutine,
  UpdateSchedule,
} from "@/lib/schemas/schedule";
import { getRoutineDetail } from "./routines";

interface ScheduledRoutineRow {
  id: number;
  routine_id: number;
  date: string;
  completed: number;
  notes: string | null;
  rating: number | null;
  created_at: string;
}

export function getScheduleByDate(date: string) {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM scheduled_routines WHERE date = ? ORDER BY id")
    .all(date) as ScheduledRoutineRow[];

  return rows.map((row) => ({
    schedule_id: row.id,
    date: row.date,
    completed: row.completed === 1,
    notes: row.notes,
    rating: row.rating,
    routine: getRoutineDetail(row.routine_id),
  }));
}

export function getScheduleByRange(from: string, to: string) {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM scheduled_routines WHERE date >= ? AND date <= ? ORDER BY date, id",
    )
    .all(from, to) as ScheduledRoutineRow[];

  return rows.map((row) => ({
    schedule_id: row.id,
    date: row.date,
    completed: row.completed === 1,
    notes: row.notes,
    rating: row.rating,
    routine: getRoutineDetail(row.routine_id),
  }));
}

export function getScheduleEntry(id: number): ScheduledRoutineRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM scheduled_routines WHERE id = ?").get(id) as
    | ScheduledRoutineRow
    | undefined;
}

export function createSchedule(data: CreateSchedule) {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO scheduled_routines (routine_id, date, notes)
       VALUES (@routine_id, @date, @notes)`,
    )
    .run({
      routine_id: data.routine_id,
      date: data.date,
      notes: data.notes ?? null,
    });

  const row = getScheduleEntry(Number(result.lastInsertRowid))!;
  return {
    schedule_id: row.id,
    date: row.date,
    completed: row.completed === 1,
    notes: row.notes,
    rating: row.rating,
    routine: getRoutineDetail(row.routine_id),
  };
}

export function updateSchedule(id: number, data: UpdateSchedule): boolean {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  if (data.completed !== undefined) {
    fields.push("completed = @completed");
    params.completed = data.completed ? 1 : 0;
  }
  if (data.notes !== undefined) {
    fields.push("notes = @notes");
    params.notes = data.notes;
  }
  if (data.date !== undefined) {
    fields.push("date = @date");
    params.date = data.date;
  }
  if (data.rating !== undefined) {
    fields.push("rating = @rating");
    params.rating = data.rating;
  }

  if (fields.length === 0) return true;

  const result = db
    .prepare(
      `UPDATE scheduled_routines SET ${fields.join(", ")} WHERE id = @id`,
    )
    .run(params);
  return result.changes > 0;
}

export function deleteSchedule(id: number): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM scheduled_routines WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

export function getTodaySchedule() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  return getScheduleByDate(today);
}

// ─── Weekly Volume ─────────────────────────────────────────

export function getWeeklyVolume(
  fromDate: string,
  toDate: string,
): { muscle_group: string; total_sets: number }[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT e.muscle_group, SUM(re.sets) AS total_sets
       FROM scheduled_routines sr
       JOIN routine_sections rs ON rs.routine_id = sr.routine_id
       JOIN routine_exercises re ON re.section_id = rs.id
       JOIN exercises e ON e.id = re.exercise_id
       WHERE sr.completed = 1
         AND sr.date >= ? AND sr.date <= ?
         AND e.muscle_group IS NOT NULL
         AND re.sets IS NOT NULL
       GROUP BY e.muscle_group
       ORDER BY e.muscle_group`,
    )
    .all(fromDate, toDate) as { muscle_group: string; total_sets: number }[];
}

// ─── Minimum Effective Dose Compliance ─────────────────────

export function getWeeklyComplianceData(fromDate: string, toDate: string) {
  const db = getDb();

  const sessionCount = db
    .prepare(
      `SELECT COUNT(*) AS cnt
       FROM scheduled_routines
       WHERE completed = 1 AND date >= ? AND date <= ?`,
    )
    .get(fromDate, toDate) as { cnt: number };

  const lowSetExercises = db
    .prepare(
      `SELECT e.name, re.sets
       FROM scheduled_routines sr
       JOIN routine_sections rs ON rs.routine_id = sr.routine_id
       JOIN routine_exercises re ON re.section_id = rs.id
       JOIN exercises e ON e.id = re.exercise_id
       WHERE sr.completed = 1 AND sr.date >= ? AND sr.date <= ?
         AND re.sets IS NOT NULL AND re.sets < 2`,
    )
    .all(fromDate, toDate) as { name: string; sets: number }[];

  const coveredGroups = db
    .prepare(
      `SELECT DISTINCT e.muscle_group
       FROM scheduled_routines sr
       JOIN routine_sections rs ON rs.routine_id = sr.routine_id
       JOIN routine_exercises re ON re.section_id = rs.id
       JOIN exercises e ON e.id = re.exercise_id
       WHERE sr.completed = 1 AND sr.date >= ? AND sr.date <= ?
         AND e.muscle_group IS NOT NULL`,
    )
    .all(fromDate, toDate) as { muscle_group: string }[];

  return {
    sessions: sessionCount.cnt,
    lowSetExercises,
    coveredMuscleGroups: coveredGroups.map((r) => r.muscle_group),
  };
}
