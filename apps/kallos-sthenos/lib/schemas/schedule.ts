import * as z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createScheduleSchema = z.object({
  routine_id: z.number().int().positive(),
  date: z.string().regex(dateRegex, "Date must be YYYY-MM-DD format"),
  notes: z.string().optional(),
});

export const updateScheduleSchema = z.object({
  completed: z.boolean().optional(),
  date: z
    .string()
    .regex(dateRegex, "Date must be YYYY-MM-DD format")
    .optional(),
  notes: z.string().optional(),
  rating: z.number().int().min(1).max(10).nullable().optional(),
});

export type CreateSchedule = z.infer<typeof createScheduleSchema>;
export type UpdateSchedule = z.infer<typeof updateScheduleSchema>;

export interface ScheduledRoutine {
  id: number;
  routine_id: number;
  date: string;
  completed: boolean;
  notes: string | null;
  rating: number | null;
  created_at: string;
}
