import { getDb } from "@/lib/db";
import type {
  CreateWorkoutLog,
  UpdateWorkoutLog,
  WorkoutLog,
} from "@/lib/schemas/workoutLog";

export function getLogsForSchedule(scheduleId: number): WorkoutLog[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT wl.*, re.exercise_id, e.name AS exercise_name
       FROM workout_logs wl
       JOIN routine_exercises re ON re.id = wl.routine_exercise_id
       JOIN exercises e ON e.id = re.exercise_id
       WHERE wl.schedule_id = ?
       ORDER BY wl.routine_exercise_id, wl.set_number`,
    )
    .all(scheduleId) as WorkoutLog[];
}

export function getExerciseHistory(
  exerciseId: number,
  limit?: number,
): WorkoutLog[] {
  const db = getDb();
  const lim = limit ?? 50;
  return db
    .prepare(
      `SELECT wl.*, sr.date, e.name AS exercise_name
       FROM workout_logs wl
       JOIN routine_exercises re ON re.id = wl.routine_exercise_id
       JOIN scheduled_routines sr ON sr.id = wl.schedule_id
       JOIN exercises e ON e.id = re.exercise_id
       WHERE re.exercise_id = ?
       ORDER BY sr.date DESC, wl.set_number
       LIMIT ?`,
    )
    .all(exerciseId, lim) as WorkoutLog[];
}

export function logSet(data: CreateWorkoutLog): WorkoutLog {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO workout_logs (schedule_id, routine_exercise_id, set_number, weight, reps, rir, notes)
       VALUES (@schedule_id, @routine_exercise_id, @set_number, @weight, @reps, @rir, @notes)`,
    )
    .run({
      schedule_id: data.schedule_id,
      routine_exercise_id: data.routine_exercise_id,
      set_number: data.set_number,
      weight: data.weight ?? null,
      reps: data.reps ?? null,
      rir: data.rir ?? null,
      notes: data.notes ?? null,
    });
  return db
    .prepare("SELECT * FROM workout_logs WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as WorkoutLog;
}

export function updateLog(id: number, data: UpdateWorkoutLog): boolean {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = @${key}`);
      params[key] = value;
    }
  }

  if (fields.length === 0) return true;

  const result = db
    .prepare(`UPDATE workout_logs SET ${fields.join(", ")} WHERE id = @id`)
    .run(params);
  return result.changes > 0;
}

export function deleteLog(id: number): boolean {
  const db = getDb();
  return (
    db.prepare("DELETE FROM workout_logs WHERE id = ?").run(id).changes > 0
  );
}
