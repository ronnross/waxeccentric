import { getDb } from "@/lib/db";
import type {
  AddSectionExercise,
  CreateRoutine,
  CreateSection,
  Routine,
  RoutineDetail,
  RoutineSection,
  SectionExercise,
  SectionFormat,
  UpdateRoutine,
  UpdateSection,
  UpdateSectionExercise,
} from "@/lib/schemas/routine";

// ─── Routines ────────────────────────────────────────────────

export function listRoutines(): Routine[] {
  const db = getDb();
  return db.prepare("SELECT * FROM routines ORDER BY name").all() as Routine[];
}

export function getRoutine(id: number): Routine | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM routines WHERE id = ?").get(id) as
    | Routine
    | undefined;
}

export function getRoutineDetail(id: number): RoutineDetail | undefined {
  const routine = getRoutine(id);
  if (!routine) return undefined;

  const db = getDb();

  const sectionRows = db
    .prepare(
      "SELECT * FROM routine_sections WHERE routine_id = ? ORDER BY position",
    )
    .all(id) as Array<{
    id: number;
    routine_id: number;
    name: string;
    format: SectionFormat;
    format_config: string | null;
    position: number;
    rest_seconds: number | null;
    notes: string | null;
  }>;

  const sections: RoutineSection[] = sectionRows.map((section) => {
    const exerciseRows = db
      .prepare(
        `SELECT re.id, re.position, re.superset_group, re.per_side,
                re.sets, re.reps, re.duration_seconds, re.rest_seconds, re.notes,
                re.rir, re.priority, re.reps_ladder,
                e.id AS exercise_id, e.name AS exercise_name, e.video_url AS exercise_video_url
         FROM routine_exercises re
         JOIN exercises e ON e.id = re.exercise_id
         WHERE re.section_id = ?
         ORDER BY re.superset_group NULLS LAST, re.position`,
      )
      .all(section.id) as Array<{
      id: number;
      position: number;
      superset_group: string | null;
      per_side: number;
      sets: number | null;
      reps: number | null;
      duration_seconds: number | null;
      rest_seconds: number | null;
      notes: string | null;
      rir: number | null;
      priority: number;
      reps_ladder: string | null;
      exercise_id: number;
      exercise_name: string;
      exercise_video_url: string | null;
    }>;

    return {
      id: section.id,
      name: section.name,
      format: section.format,
      format_config: section.format_config
        ? JSON.parse(section.format_config)
        : null,
      position: section.position,
      rest_seconds: section.rest_seconds,
      notes: section.notes,
      exercises: exerciseRows.map((row) => ({
        id: row.id,
        exercise: {
          id: row.exercise_id,
          name: row.exercise_name,
          video_url: row.exercise_video_url,
        },
        position: row.position,
        superset_group: row.superset_group,
        per_side: row.per_side === 1,
        sets: row.sets,
        reps: row.reps,
        duration_seconds: row.duration_seconds,
        rest_seconds: row.rest_seconds,
        notes: row.notes,
        rir: row.rir ?? null,
        priority: row.priority === 1,
        reps_ladder: row.reps_ladder ? JSON.parse(row.reps_ladder) : null,
      })),
    };
  });

  return { ...routine, sections };
}

export function createRoutine(data: CreateRoutine): Routine {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO routines (name, description) VALUES (@name, @description)",
    )
    .run({ name: data.name, description: data.description ?? null });
  return getRoutine(Number(result.lastInsertRowid))!;
}

export function updateRoutine(
  id: number,
  data: UpdateRoutine,
): Routine | undefined {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = @${key}`);
      params[key] = value;
    }
  }

  if (fields.length === 0) return getRoutine(id);

  fields.push("updated_at = datetime('now')");
  db.prepare(`UPDATE routines SET ${fields.join(", ")} WHERE id = @id`).run(
    params,
  );
  return getRoutine(id);
}

export function deleteRoutine(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM routines WHERE id = ?").run(id);
  return result.changes > 0;
}

// ─── Sections ────────────────────────────────────────────────

export function createSection(routineId: number, data: CreateSection): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO routine_sections (routine_id, name, format, format_config, position, rest_seconds, notes)
       VALUES (@routine_id, @name, @format, @format_config, @position, @rest_seconds, @notes)`,
    )
    .run({
      routine_id: routineId,
      name: data.name,
      format: data.format ?? "straight",
      format_config: data.format_config
        ? JSON.stringify(data.format_config)
        : null,
      position: data.position,
      rest_seconds: data.rest_seconds ?? null,
      notes: data.notes ?? null,
    });
  return Number(result.lastInsertRowid);
}

export function updateSection(sectionId: number, data: UpdateSection): boolean {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id: sectionId };

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (key === "format_config") {
        fields.push("format_config = @format_config");
        params.format_config = value ? JSON.stringify(value) : null;
      } else {
        fields.push(`${key} = @${key}`);
        params[key] = value;
      }
    }
  }

  if (fields.length === 0) return true;

  const result = db
    .prepare(`UPDATE routine_sections SET ${fields.join(", ")} WHERE id = @id`)
    .run(params);
  return result.changes > 0;
}

export function deleteSection(sectionId: number): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM routine_sections WHERE id = ?")
    .run(sectionId);
  return result.changes > 0;
}

export function swapSectionPositions(
  routineId: number,
  sectionIdA: number,
  sectionIdB: number,
): boolean {
  const db = getDb();
  const getPos = db.prepare(
    "SELECT id, position FROM routine_sections WHERE id = ? AND routine_id = ?",
  );
  const a = getPos.get(sectionIdA, routineId) as
    | { id: number; position: number }
    | undefined;
  const b = getPos.get(sectionIdB, routineId) as
    | { id: number; position: number }
    | undefined;
  if (!a || !b) return false;

  const swap = db.transaction(() => {
    // Use a temporary position to avoid UNIQUE constraint violation
    db.prepare("UPDATE routine_sections SET position = -1 WHERE id = ?").run(
      a.id,
    );
    db.prepare("UPDATE routine_sections SET position = ? WHERE id = ?").run(
      a.position,
      b.id,
    );
    db.prepare("UPDATE routine_sections SET position = ? WHERE id = ?").run(
      b.position,
      a.id,
    );
  });
  swap();
  return true;
}

// ─── Section Exercises ───────────────────────────────────────

export function addExerciseToSection(data: AddSectionExercise): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO routine_exercises
         (section_id, exercise_id, position, superset_group, per_side, sets, reps, duration_seconds, rest_seconds, notes, rir, priority, reps_ladder)
       VALUES
         (@section_id, @exercise_id, @position, @superset_group, @per_side, @sets, @reps, @duration_seconds, @rest_seconds, @notes, @rir, @priority, @reps_ladder)`,
    )
    .run({
      section_id: data.section_id,
      exercise_id: data.exercise_id,
      position: data.position,
      superset_group: data.superset_group ?? null,
      per_side: data.per_side ? 1 : 0,
      sets: data.sets ?? null,
      reps: data.reps ?? null,
      duration_seconds: data.duration_seconds ?? null,
      rest_seconds: data.rest_seconds ?? null,
      notes: data.notes ?? null,
      rir: data.rir ?? null,
      priority: data.priority ? 1 : 0,
      reps_ladder: data.reps_ladder ? JSON.stringify(data.reps_ladder) : null,
    });
  return Number(result.lastInsertRowid);
}

export function updateSectionExercise(
  id: number,
  data: UpdateSectionExercise,
): boolean {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (key === "per_side" || key === "priority") {
        fields.push(`${key} = @${key}`);
        params[key] = value ? 1 : 0;
      } else if (key === "reps_ladder") {
        fields.push(`${key} = @${key}`);
        params[key] = value ? JSON.stringify(value) : null;
      } else {
        fields.push(`${key} = @${key}`);
        params[key] = value;
      }
    }
  }

  if (fields.length === 0) return true;

  const result = db
    .prepare(`UPDATE routine_exercises SET ${fields.join(", ")} WHERE id = @id`)
    .run(params);
  return result.changes > 0;
}

export function removeExerciseFromSection(id: number): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM routine_exercises WHERE id = ?")
    .run(id);
  return result.changes > 0;
}
