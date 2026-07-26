import * as z from "zod";

export const createWorkoutLogSchema = z.object({
  schedule_id: z.number().int().positive(),
  routine_exercise_id: z.number().int().positive(),
  set_number: z.number().int().positive(),
  weight: z.number().positive().nullable().optional(),
  reps: z.number().int().positive().nullable().optional(),
  rir: z.number().int().min(0).max(5).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updateWorkoutLogSchema = z.object({
  weight: z.number().positive().nullable().optional(),
  reps: z.number().int().positive().nullable().optional(),
  rir: z.number().int().min(0).max(5).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CreateWorkoutLog = z.infer<typeof createWorkoutLogSchema>;
export type UpdateWorkoutLog = z.infer<typeof updateWorkoutLogSchema>;

export interface WorkoutLog {
  id: number;
  schedule_id: number;
  routine_exercise_id: number;
  set_number: number;
  weight: number | null;
  reps: number | null;
  rir: number | null;
  notes: string | null;
  logged_at: string;
  date?: string;
  exercise_name?: string;
  exercise_id?: number;
}
