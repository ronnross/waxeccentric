import * as z from "zod";

export const sectionFormats = [
  "straight",
  "rounds",
  "emom",
  "superset",
  "tabata",
  "warm-up",
  "cool-down",
  "ladder",
] as const;
export type SectionFormat = (typeof sectionFormats)[number];

// --- Routine CRUD ---

export const createRoutineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateRoutineSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
});

// --- Section CRUD ---

export const createSectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  format: z.enum(sectionFormats).default("straight"),
  format_config: z.record(z.string(), z.unknown()).optional(),
  position: z.number().int().positive(),
  rest_seconds: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const updateSectionSchema = z.object({
  name: z.string().min(1).optional(),
  format: z.enum(sectionFormats).optional(),
  format_config: z.record(z.string(), z.unknown()).optional(),
  position: z.number().int().positive().optional(),
  rest_seconds: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

// --- Section Exercise CRUD ---

export const addSectionExerciseSchema = z.object({
  section_id: z.number().int().positive(),
  exercise_id: z.number().int().positive(),
  position: z.number().int().positive(),
  superset_group: z.string().optional(),
  per_side: z.boolean().default(false),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  duration_seconds: z.number().int().positive().optional(),
  rest_seconds: z.number().int().positive().optional(),
  notes: z.string().optional(),
  rir: z.number().int().min(0).max(5).nullable().optional(),
  priority: z.boolean().default(false),
  reps_ladder: z.array(z.number().int().positive()).nullable().optional(),
});

export const updateSectionExerciseSchema = z.object({
  section_id: z.number().int().positive().optional(),
  position: z.number().int().positive().optional(),
  superset_group: z.string().nullable().optional(),
  per_side: z.boolean().optional(),
  sets: z.number().int().positive().nullable().optional(),
  reps: z.number().int().positive().nullable().optional(),
  duration_seconds: z.number().int().positive().nullable().optional(),
  rest_seconds: z.number().int().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
  rir: z.number().int().min(0).max(5).nullable().optional(),
  priority: z.boolean().optional(),
  reps_ladder: z.array(z.number().int().positive()).nullable().optional(),
});

// --- Inferred types ---

export type CreateRoutine = z.infer<typeof createRoutineSchema>;
export type UpdateRoutine = z.infer<typeof updateRoutineSchema>;
export type CreateSection = z.infer<typeof createSectionSchema>;
export type UpdateSection = z.infer<typeof updateSectionSchema>;
export type AddSectionExercise = z.infer<typeof addSectionExerciseSchema>;
export type UpdateSectionExercise = z.infer<typeof updateSectionExerciseSchema>;

// --- Interfaces ---

export interface Routine {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SectionExercise {
  id: number;
  exercise: { id: number; name: string; video_url: string | null };
  position: number;
  superset_group: string | null;
  per_side: boolean;
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number | null;
  notes: string | null;
  rir: number | null;
  priority: boolean;
  reps_ladder: number[] | null;
}

export interface RoutineSection {
  id: number;
  name: string;
  format: SectionFormat;
  format_config: Record<string, unknown> | null;
  position: number;
  rest_seconds: number | null;
  notes: string | null;
  exercises: SectionExercise[];
}

export interface RoutineDetail extends Routine {
  sections: RoutineSection[];
}
