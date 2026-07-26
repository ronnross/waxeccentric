import * as z from "zod";

const mediaUrlSchema = z
  .string()
  .refine((value) => {
    if (value.startsWith("/")) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL or absolute path")
  .optional()
  .or(z.literal(""));

export const createExerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  muscle_group: z.string().optional(),
  equipment: z.string().optional(),
  image_url: mediaUrlSchema,
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const updateExerciseSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  muscle_group: z.string().optional(),
  equipment: z.string().optional(),
  image_url: mediaUrlSchema,
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type CreateExercise = z.infer<typeof createExerciseSchema>;
export type UpdateExercise = z.infer<typeof updateExerciseSchema>;

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  muscle_group: string | null;
  equipment: string | null;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}
