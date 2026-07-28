import path from "node:path";
import Database from "better-sqlite3";

interface ExerciseRow {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  muscle_group: string | null;
  equipment: string | null;
  image_url: string | null;
  video_url: string | null;
}

interface RoutineRow {
  id: number;
  name: string;
  description: string | null;
}

interface SectionRow {
  id: number;
  routine_id: number;
  name: string;
  format: string;
  format_config: string | null;
  position: number;
  rest_seconds: number | null;
  notes: string | null;
}

interface RoutineExerciseRow {
  section_id: number;
  exercise_id: number;
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
}

interface ScheduleRow {
  id: number;
  routine_id: number;
  date: string;
  completed: number;
  notes: string | null;
  rating: number | null;
}

interface ApiExercise {
  id: number;
  name: string;
}

interface ApiRoutine {
  id: number;
  name: string;
}

interface ApiSectionExercise {
  id: number;
  position: number;
  superset_group: string | null;
}

interface ApiSection {
  id: number;
  position: number;
  exercises: ApiSectionExercise[];
}

interface ApiRoutineDetail extends ApiRoutine {
  sections: ApiSection[];
}

interface ApiSchedule {
  schedule_id: number;
  date: string;
  routine: ApiRoutine | null;
}

function usage(): never {
  console.error(
    "Usage: pnpm db:import-api <base-url> <snapshot.db> [--apply]",
  );
  process.exit(1);
}

const [baseUrlArg, snapshotArg, mode] = process.argv.slice(2);
if (!baseUrlArg || !snapshotArg || (mode && mode !== "--apply")) usage();

const baseUrl = new URL(baseUrlArg);
baseUrl.pathname = baseUrl.pathname.replace(/\/$/, "");
if (!baseUrl.pathname.endsWith("/kallos-sthenos")) {
  throw new Error("Base URL must end with /kallos-sthenos");
}

const snapshotPath = path.resolve(process.cwd(), snapshotArg);
const source = new Database(snapshotPath, {
  readonly: true,
  fileMustExist: true,
});

async function request<T>(
  pathname: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl.origin}${baseUrl.pathname}${pathname}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `${init?.method ?? "GET"} ${pathname} failed (${response.status}): ${await response.text()}`,
    );
  }

  return response.json() as Promise<T>;
}

function body(value: unknown): Pick<RequestInit, "body"> {
  return { body: JSON.stringify(value) };
}

async function main() {
  const integrity = source.pragma("integrity_check", { simple: true });
  if (integrity !== "ok") {
    throw new Error(`Snapshot integrity check failed: ${integrity}`);
  }

  const exercises = source
    .prepare("SELECT * FROM exercises ORDER BY id")
    .all() as ExerciseRow[];
  const routines = source
    .prepare("SELECT * FROM routines ORDER BY id")
    .all() as RoutineRow[];
  const sections = source
    .prepare("SELECT * FROM routine_sections ORDER BY routine_id, position")
    .all() as SectionRow[];
  const routineExercises = source
    .prepare("SELECT * FROM routine_exercises ORDER BY section_id, position")
    .all() as RoutineExerciseRow[];
  const schedules = source
    .prepare("SELECT * FROM scheduled_routines ORDER BY date, id")
    .all() as ScheduleRow[];

  if (exercises.length === 0 || routines.length === 0) {
    throw new Error("Snapshot must contain exercises and routines");
  }

  const targetExercises = await request<ApiExercise[]>("/api/exercises");
  const targetRoutines = await request<ApiRoutine[]>("/api/routines");

  console.log(`Snapshot: ${exercises.length} exercises, ${routines.length} routines`);
  console.log(
    `Target: ${targetExercises.length} exercises, ${targetRoutines.length} routines`,
  );

  if (mode !== "--apply") {
    console.log("Dry run complete. Add --apply to import through the API.");
    return;
  }

  const exerciseIds = new Map(
    targetExercises.map((exercise) => [exercise.name, exercise.id]),
  );
  for (const exercise of exercises) {
    if (exerciseIds.has(exercise.name)) continue;

    const created = await request<ApiExercise>("/api/exercises", {
      method: "POST",
      ...body({
        name: exercise.name,
        description: exercise.description ?? undefined,
        category: exercise.category ?? undefined,
        muscle_group: exercise.muscle_group ?? undefined,
        equipment: exercise.equipment ?? undefined,
        image_url: exercise.image_url ?? undefined,
        video_url: exercise.video_url ?? undefined,
      }),
    });
    exerciseIds.set(created.name, created.id);
  }
  console.log(`Exercises ready: ${exerciseIds.size}`);

  const routineIds = new Map(
    targetRoutines.map((routine) => [routine.name, routine.id]),
  );
  const sourceRoutineById = new Map(
    routines.map((routine) => [routine.id, routine]),
  );
  const sourceExerciseById = new Map(
    exercises.map((exercise) => [exercise.id, exercise]),
  );

  for (const routine of routines) {
    let routineId = routineIds.get(routine.name);
    if (!routineId) {
      const created = await request<ApiRoutine>("/api/routines", {
        method: "POST",
        ...body({
          name: routine.name,
          description: routine.description ?? undefined,
        }),
      });
      routineId = created.id;
      routineIds.set(created.name, created.id);
    }

    let detail = await request<ApiRoutineDetail>(`/api/routines/${routineId}`);
    const routineSections = sections.filter(
      (section) => section.routine_id === routine.id,
    );

    for (const section of routineSections) {
      let targetSection = detail.sections.find(
        (candidate) => candidate.position === section.position,
      );
      if (!targetSection) {
        detail = await request<ApiRoutineDetail>(
          `/api/routines/${routineId}/sections`,
          {
            method: "POST",
            ...body({
              name: section.name,
              format: section.format,
              format_config: section.format_config
                ? JSON.parse(section.format_config)
                : undefined,
              position: section.position,
              rest_seconds: section.rest_seconds ?? undefined,
              notes: section.notes ?? undefined,
            }),
          },
        );
        targetSection = detail.sections.find(
          (candidate) => candidate.position === section.position,
        );
      }
      if (!targetSection) throw new Error(`Failed to create section ${section.id}`);

      const entries = routineExercises.filter(
        (entry) => entry.section_id === section.id,
      );
      for (const entry of entries) {
        const exists = targetSection.exercises.some(
          (candidate) =>
            candidate.position === entry.position &&
            candidate.superset_group === entry.superset_group,
        );
        if (exists) continue;

        const sourceExercise = sourceExerciseById.get(entry.exercise_id);
        const targetExerciseId = sourceExercise
          ? exerciseIds.get(sourceExercise.name)
          : undefined;
        if (!targetExerciseId) {
          throw new Error(`Missing exercise mapping for ${entry.exercise_id}`);
        }

        detail = await request<ApiRoutineDetail>(
          `/api/routines/${routineId}/exercises`,
          {
            method: "POST",
            ...body({
              section_id: targetSection.id,
              exercise_id: targetExerciseId,
              position: entry.position,
              superset_group: entry.superset_group ?? undefined,
              per_side: entry.per_side === 1,
              sets: entry.sets ?? undefined,
              reps: entry.reps ?? undefined,
              duration_seconds: entry.duration_seconds ?? undefined,
              rest_seconds: entry.rest_seconds ?? undefined,
              notes: entry.notes ?? undefined,
              rir: entry.rir ?? undefined,
              priority: entry.priority === 1,
              reps_ladder: entry.reps_ladder
                ? JSON.parse(entry.reps_ladder)
                : undefined,
            }),
          },
        );
        targetSection = detail.sections.find(
          (candidate) => candidate.position === section.position,
        ) as ApiSection;
      }
    }
    console.log(`Routine ready: ${routine.name}`);
  }

  if (schedules.length > 0) {
    const dates = schedules.map((schedule) => schedule.date).sort();
    const targetSchedules = await request<ApiSchedule[]>(
      `/api/schedule?from=${dates[0]}&to=${dates.at(-1)}`,
    );

    for (const schedule of schedules) {
      const sourceRoutine = sourceRoutineById.get(schedule.routine_id);
      const routineId = sourceRoutine
        ? routineIds.get(sourceRoutine.name)
        : undefined;
      if (!sourceRoutine || !routineId) {
        throw new Error(`Missing routine mapping for schedule ${schedule.id}`);
      }

      const exists = targetSchedules.some(
        (candidate) =>
          candidate.date === schedule.date &&
          candidate.routine?.name === sourceRoutine.name,
      );
      if (exists) continue;

      const created = await request<ApiSchedule>("/api/schedule", {
        method: "POST",
        ...body({
          routine_id: routineId,
          date: schedule.date,
          notes: schedule.notes ?? undefined,
        }),
      });

      if (schedule.completed === 1 || schedule.rating !== null) {
        await request<{ success: boolean }>(
          `/api/schedule/${created.schedule_id}`,
          {
            method: "PATCH",
            ...body({
              completed: schedule.completed === 1,
              rating: schedule.rating,
            }),
          },
        );
      }
    }
  }

  const importedExercises = await request<ApiExercise[]>("/api/exercises");
  const importedRoutines = await request<ApiRoutine[]>("/api/routines");
  console.log(
    `Import complete: ${importedExercises.length} exercises, ${importedRoutines.length} routines`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => source.close());