import * as z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createGtgProgramSchema = z.object({
  exercise_id: z.number().int().positive(),
  daily_goal: z.number().int().positive().min(1),
  reps_per_set: z.number().int().positive().min(1),
  start_date: z.string().regex(dateRegex, "Date must be YYYY-MM-DD format"),
  end_date: z.string().regex(dateRegex, "Date must be YYYY-MM-DD format"),
});

export const logSetSchema = z.object({
  date: z.string().regex(dateRegex, "Date must be YYYY-MM-DD format"),
});

export type CreateGtgProgram = z.infer<typeof createGtgProgramSchema>;
