import { getDb } from "@/lib/db";
import type {
  CreateExercise,
  Exercise,
  UpdateExercise,
} from "@/lib/schemas/exercise";

export function listExercises(filters?: {
  category?: string;
  muscle_group?: string;
}): Exercise[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters?.category) {
    conditions.push("category = @category");
    params.category = filters.category;
  }
  if (filters?.muscle_group) {
    conditions.push("muscle_group = @muscle_group");
    params.muscle_group = filters.muscle_group;
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const stmt = db.prepare(`SELECT * FROM exercises ${where} ORDER BY name`);
  return stmt.all(params) as Exercise[];
}

export function getExercise(id: number): Exercise | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM exercises WHERE id = ?");
  return stmt.get(id) as Exercise | undefined;
}

export function createExercise(data: CreateExercise): Exercise {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO exercises (name, description, category, muscle_group, equipment, image_url, video_url)
    VALUES (@name, @description, @category, @muscle_group, @equipment, @image_url, @video_url)
  `);
  const result = stmt.run({
    name: data.name,
    description: data.description ?? null,
    category: data.category ?? null,
    muscle_group: data.muscle_group ?? null,
    equipment: data.equipment ?? null,
    image_url: data.image_url || null,
    video_url: data.video_url || null,
  });
  return getExercise(Number(result.lastInsertRowid))!;
}

export function updateExercise(
  id: number,
  data: UpdateExercise,
): Exercise | undefined {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = @${key}`);
      params[key] = value === "" ? null : value;
    }
  }

  if (fields.length === 0) return getExercise(id);

  fields.push("updated_at = datetime('now')");
  const stmt = db.prepare(
    `UPDATE exercises SET ${fields.join(", ")} WHERE id = @id`,
  );
  stmt.run(params);
  return getExercise(id);
}

export function deleteExercise(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM exercises WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
