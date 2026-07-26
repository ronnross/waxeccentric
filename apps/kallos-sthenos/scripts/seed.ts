/**
 * Seed script — populates the database with exercises, routines, and the Week 1 kettlebell on-ramp.
 * Run with: npx tsx scripts/seed.ts
 */
import { getDb } from "../lib/db/index";

const db = getDb();

// ─── Seed Exercises ──────────────────────────────────────────

const exercises = [
  // Cardio / warm-up
  {
    name: "Jump Rope",
    description: "Light skipping to elevate heart rate",
    category: "cardio",
    muscle_group: "full body",
    equipment: "jump rope",
  },
  // Mobility
  {
    name: "Arm Circles",
    description: "Forward and backward circles to warm up shoulders",
    category: "mobility",
    muscle_group: "upper push",
    equipment: "none",
  },
  {
    name: "Leg Swings",
    description: "Forward/back and side-to-side swings",
    category: "mobility",
    muscle_group: "lower",
    equipment: "none",
  },
  {
    name: "Asian Squat",
    description: "Very deep relaxed squat hold to open hips and ankles",
    category: "mobility",
    muscle_group: "lower",
    equipment: "none",
  },
  // Barbell strength
  {
    name: "Barbell Squat",
    description: "Back squat with barbell on traps",
    category: "strength",
    muscle_group: "lower",
    equipment: "barbell",
  },
  {
    name: "Bench Press",
    description: "Flat barbell bench press",
    category: "strength",
    muscle_group: "upper push",
    equipment: "barbell",
  },
  {
    name: "Bent-Over Row",
    description: "Barbell row with overhand grip",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "barbell",
  },
  {
    name: "Overhead Press",
    description: "Standing barbell press",
    category: "strength",
    muscle_group: "upper push",
    equipment: "barbell",
  },
  {
    name: "Deadlift",
    description: "Conventional deadlift from the floor",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "barbell",
  },
  {
    name: "Plank",
    description: "Hold a straight-arm or forearm plank",
    category: "strength",
    muscle_group: "core",
    equipment: "none",
  },
  // Stretching
  {
    name: "Hamstring Stretch",
    description: "Standing or seated hamstring stretch",
    category: "stretching",
    muscle_group: "lower",
    equipment: "none",
  },
  {
    name: "Child's Pose",
    description: "Yoga rest pose for back and hips",
    category: "stretching",
    muscle_group: "upper pull",
    equipment: "none",
  },
  {
    name: "Chest Stretch",
    description: "Doorway or wall chest stretch",
    category: "stretching",
    muscle_group: "upper push",
    equipment: "none",
  },
  // Kettlebell exercises
  {
    name: "Kettlebell Swing",
    description: "Hip-hinge swing driving the bell to chest height",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Goblet Squat",
    description: "Squat holding the kettlebell at chest level",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Turkish Get-Up",
    description: "Floor-to-standing while pressing the bell overhead",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Clean",
    description: "Swing the bell from between legs to rack position",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Snatch",
    description: "One fluid motion from between legs to overhead lockout",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Press",
    description: "Strict overhead press from rack position",
    category: "strength",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Row",
    description: "Single-arm bent-over row with kettlebell",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Deadlift",
    description: "Hinge to pick up one or two kettlebells from the floor",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Front Squat",
    description: "Double or single rack position front squat",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Halo",
    description: "Circle the bell around your head to warm up shoulders",
    category: "mobility",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Windmill",
    description: "Hip hinge with bell pressed overhead, free hand to floor",
    category: "mobility",
    muscle_group: "core",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Farmer's Carry",
    description: "Walk with heavy kettlebells at your sides",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Thruster",
    description: "Front squat into an overhead press in one movement",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Lunge",
    description: "Walking or reverse lunge holding kettlebell(s)",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Floor Press",
    description: "Lying on the floor, press kettlebell(s) from chest",
    category: "strength",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell High Pull",
    description: "Explosive pull from hip hinge to chin height",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Around the World",
    description: "Pass the bell around your waist hand to hand",
    category: "mobility",
    muscle_group: "core",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Figure 8",
    description: "Pass the bell between legs in a figure-8 pattern",
    category: "mobility",
    muscle_group: "core",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Renegade Row",
    description: "Plank position alternating rows with two kettlebells",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Sumo Deadlift",
    description: "Wide-stance deadlift with kettlebell between feet",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  // New exercises needed for Week 1 on-ramp
  {
    name: "Push-ups",
    description: "Standard or modified push-ups",
    category: "strength",
    muscle_group: "upper push",
    equipment: "none",
  },
  {
    name: "Kettlebell RDL",
    description: "Romanian deadlift with kettlebell, hinge at hips",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Drag",
    description: "Plank position pull-through, dragging KB side to side",
    category: "strength",
    muscle_group: "core",
    equipment: "kettlebell",
  },
  {
    name: "T-Plank Rotation",
    description: "Side plank rotation from high plank position",
    category: "strength",
    muscle_group: "core",
    equipment: "none",
  },
  {
    name: "Kettlebell Seesaw Row",
    description: "Bent-over alternating rows with two kettlebells",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "3-Position KB Snatch Drill",
    description: "Snatch progression hitting 3 positions per rep",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Kettlebell Halo to Shoulder",
    description: "Halo around head transitioning to front rack shoulder press",
    category: "strength",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "Goblet Curtsy Lunge",
    description: "Curtsy lunge holding kettlebell in goblet position",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "Goblet Carry",
    description: "Walk holding kettlebell in goblet position at chest",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Goblet March",
    description: "March in place holding kettlebell in goblet position",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "TGU Roll to Tall-Sit",
    description: "Turkish Get-Up partial — roll to elbow then tall sit",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Slalom Hip Shift",
    description: "Side-to-side hip shift for hip mobility and stability",
    category: "mobility",
    muscle_group: "lower",
    equipment: "none",
  },
  // New exercises for Weeks 5-7 on-ramp
  {
    name: "Kang Squat",
    description:
      "Hands behind head, squat then hinge and stand — hip mobility drill",
    category: "mobility",
    muscle_group: "lower",
    equipment: "none",
  },
  {
    name: "Seesaw Press",
    description:
      "Double KB alternating press — one goes up as the other comes down",
    category: "strength",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "SA Front Rack Step-Back Lunge",
    description: "Step-back lunge with KB in single-arm front rack position",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "DBL KB Front Rack Step-Back Lunge",
    description: "Step-back lunge with both KBs in front rack position",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "Farmer Grip Kickstand RDL",
    description: "Kickstand RDL holding KBs at sides in farmer grip",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "TGU Roll to High Hip Bridge",
    description:
      "Turkish Get-Up partial — roll to elbow, tall-sit, then high hip bridge",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Double KB Clean",
    description: "Clean two kettlebells simultaneously to rack position",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "SA Front Rack Carry",
    description: "Walk carrying one KB in front rack position",
    category: "strength",
    muscle_group: "core",
    equipment: "kettlebell",
  },
  {
    name: "KB Half-Snatch",
    description:
      "Snatch KB to overhead then lower to rack position, not between legs",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "SA Overhead March",
    description: "March in place holding one KB locked out overhead",
    category: "strength",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "Pike Toe Taps",
    description: "From pike position, alternately tap opposite hand to toe",
    category: "mobility",
    muscle_group: "core",
    equipment: "none",
  },
  {
    name: "Goblet Cossack Squat",
    description: "Lateral squat with KB in goblet position, one leg straight",
    category: "strength",
    muscle_group: "lower",
    equipment: "kettlebell",
  },
  {
    name: "Steel Mace Stop & Go 360s",
    description:
      "Steel mace 360 rotations with controlled stops, or KB halo alternative",
    category: "strength",
    muscle_group: "upper push",
    equipment: "steel mace",
  },
  {
    name: "FSB Halos",
    description:
      "Flow System Bar halos around the head, or use KB halos as alternative",
    category: "mobility",
    muscle_group: "upper push",
    equipment: "steel mace",
  },
  // New exercises for Week 9
  {
    name: "Double KB Thruster",
    description: "Double KB front squat into overhead press in one movement",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "FSB Rotational Snatch",
    description: "Flow System Bar rotational snatch, or KB snatch alternative",
    category: "strength",
    muscle_group: "full body",
    equipment: "steel mace",
  },
  {
    name: "Single Leg RDL",
    description: "Single-leg Romanian deadlift for posterior chain and balance",
    category: "strength",
    muscle_group: "upper pull",
    equipment: "kettlebell",
  },
  {
    name: "KB Suitcase Carry",
    description: "Walk carrying one KB at your side like a suitcase",
    category: "strength",
    muscle_group: "core",
    equipment: "kettlebell",
  },
  {
    name: "KB Swing to Goblet Squat",
    description: "Swing the KB up and catch in goblet position, then squat",
    category: "strength",
    muscle_group: "full body",
    equipment: "kettlebell",
  },
  {
    name: "Double KB Push Press",
    description: "Double KB overhead press with leg drive",
    category: "strength",
    muscle_group: "upper push",
    equipment: "kettlebell",
  },
  {
    name: "Macebell 10 & 2s",
    description: "Macebell 10 & 2 swings, or KB halo alternative",
    category: "strength",
    muscle_group: "upper push",
    equipment: "steel mace",
  },
  {
    name: "Bodyweight Curtsy Lunge",
    description: "Curtsy lunge with no weight for warm-up",
    category: "mobility",
    muscle_group: "lower",
    equipment: "none",
  },
  {
    name: "March in Place",
    description: "March in place, optionally holding KB",
    category: "cardio",
    muscle_group: "full body",
    equipment: "none",
  },
];

const insertExercise = db.prepare(`
  INSERT OR IGNORE INTO exercises (name, description, category, muscle_group, equipment)
  VALUES (@name, @description, @category, @muscle_group, @equipment)
`);

const insertManyExercises = db.transaction(() => {
  for (const ex of exercises) {
    insertExercise.run(ex);
  }
});

insertManyExercises();
console.log(`✓ Seeded ${exercises.length} exercises`);

// ─── Helpers ─────────────────────────────────────────────────

function exId(name: string): number {
  const row = db.prepare("SELECT id FROM exercises WHERE name = ?").get(name) as
    | { id: number }
    | undefined;
  if (!row) throw new Error(`Exercise not found: "${name}"`);
  return row.id;
}

const insertSection = db.prepare(`
  INSERT INTO routine_sections (routine_id, name, format, format_config, position, rest_seconds, notes)
  VALUES (@routine_id, @name, @format, @format_config, @position, @rest_seconds, @notes)
`);

const insertRE = db.prepare(`
  INSERT INTO routine_exercises (section_id, exercise_id, position, superset_group, per_side, sets, reps, duration_seconds, rest_seconds, notes)
  VALUES (@section_id, @exercise_id, @position, @superset_group, @per_side, @sets, @reps, @duration_seconds, @rest_seconds, @notes)
`);

interface SectionDef {
  name: string;
  format: string;
  format_config?: Record<string, unknown>;
  position: number;
  rest_seconds?: number;
  notes?: string;
}

interface ExerciseDef {
  exercise: string;
  position: number;
  superset_group?: string;
  per_side?: boolean;
  sets?: number;
  reps?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  notes?: string;
}

function seedRoutine(
  name: string,
  description: string,
  sections: Array<{ section: SectionDef; exercises: ExerciseDef[] }>,
): number {
  const result = db
    .prepare("INSERT OR IGNORE INTO routines (name, description) VALUES (?, ?)")
    .run(name, description);

  if (result.changes === 0) {
    console.log(`  Routine "${name}" already exists, skipping`);
    const existing = db
      .prepare("SELECT id FROM routines WHERE name = ?")
      .get(name) as { id: number };
    return existing.id;
  }

  const routineId = Number(result.lastInsertRowid);

  for (const { section, exercises: exs } of sections) {
    const secResult = insertSection.run({
      routine_id: routineId,
      name: section.name,
      format: section.format,
      format_config: section.format_config
        ? JSON.stringify(section.format_config)
        : null,
      position: section.position,
      rest_seconds: section.rest_seconds ?? null,
      notes: section.notes ?? null,
    });
    const sectionId = Number(secResult.lastInsertRowid);

    for (const ex of exs) {
      insertRE.run({
        section_id: sectionId,
        exercise_id: exId(ex.exercise),
        position: ex.position,
        superset_group: ex.superset_group ?? null,
        per_side: ex.per_side ? 1 : 0,
        sets: ex.sets ?? null,
        reps: ex.reps ?? null,
        duration_seconds: ex.duration_seconds ?? null,
        rest_seconds: ex.rest_seconds ?? null,
        notes: ex.notes ?? null,
      });
    }
  }

  console.log(`✓ Seeded routine "${name}" with ${sections.length} sections`);
  return routineId;
}

// ─── Full Body A (converted to sections) ─────────────────────

const seedAll = db.transaction(() => {
  const fullBodyId = seedRoutine(
    "Full Body A",
    "Balanced full-body workout day",
    [
      {
        section: { name: "Warm-Up", format: "straight", position: 1 },
        exercises: [
          {
            exercise: "Jump Rope",
            position: 1,
            duration_seconds: 180,
            sets: 1,
            notes: "Light pace",
          },
          { exercise: "Arm Circles", position: 2, sets: 2, reps: 15 },
          {
            exercise: "Leg Swings",
            position: 3,
            sets: 2,
            reps: 10,
            notes: "Each leg",
          },
        ],
      },
      {
        section: { name: "Workout", format: "straight", position: 2 },
        exercises: [
          {
            exercise: "Barbell Squat",
            position: 1,
            sets: 4,
            reps: 8,
            rest_seconds: 120,
          },
          {
            exercise: "Bench Press",
            position: 2,
            sets: 4,
            reps: 8,
            rest_seconds: 120,
          },
          {
            exercise: "Bent-Over Row",
            position: 3,
            sets: 4,
            reps: 8,
            rest_seconds: 90,
          },
          {
            exercise: "Overhead Press",
            position: 4,
            sets: 3,
            reps: 10,
            rest_seconds: 90,
          },
          {
            exercise: "Plank",
            position: 5,
            sets: 3,
            duration_seconds: 60,
            rest_seconds: 60,
          },
        ],
      },
      {
        section: { name: "Cool-Down", format: "straight", position: 3 },
        exercises: [
          {
            exercise: "Hamstring Stretch",
            position: 1,
            sets: 1,
            duration_seconds: 30,
            per_side: true,
          },
          {
            exercise: "Child's Pose",
            position: 2,
            sets: 1,
            duration_seconds: 60,
          },
          {
            exercise: "Chest Stretch",
            position: 3,
            sets: 1,
            duration_seconds: 30,
            per_side: true,
          },
        ],
      },
    ],
  );

  // ─── Week 1, Workout 1 ──────────────────────────────────────

  seedRoutine("Week 1 – Workout 1", "KB On-Ramp: Cleans, Front Squats, EMOM", [
    {
      section: {
        name: "Primer",
        format: "rounds",
        format_config: { rounds: 2 },
        position: 1,
      },
      exercises: [
        { exercise: "Kettlebell RDL", position: 1, reps: 5 },
        { exercise: "Kettlebell Clean", position: 2, reps: 5, per_side: true },
        {
          exercise: "Kettlebell Front Squat",
          position: 3,
          reps: 5,
          per_side: true,
        },
        {
          exercise: "Kettlebell Halo",
          position: 4,
          reps: 5,
          per_side: true,
          notes: "Each direction",
        },
      ],
    },
    {
      section: {
        name: "Part A",
        format: "emom",
        format_config: { duration_minutes: 16 },
        position: 2,
      },
      exercises: [
        {
          exercise: "Kettlebell Clean",
          position: 1,
          reps: 3,
          superset_group: "ODD",
          notes: "Left side",
        },
        {
          exercise: "Kettlebell Front Squat",
          position: 2,
          reps: 3,
          superset_group: "ODD",
          notes: "Left side",
        },
        {
          exercise: "Push-ups",
          position: 3,
          reps: 5,
          superset_group: "ODD",
          notes: "3-5 reps",
        },
        {
          exercise: "Kettlebell Clean",
          position: 4,
          reps: 3,
          superset_group: "EVEN",
          notes: "Right side",
        },
        {
          exercise: "Kettlebell Front Squat",
          position: 5,
          reps: 3,
          superset_group: "EVEN",
          notes: "Right side",
        },
        {
          exercise: "Push-ups",
          position: 6,
          reps: 5,
          superset_group: "EVEN",
          notes: "3-5 reps",
        },
      ],
    },
    {
      section: {
        name: "Part B",
        format: "straight",
        position: 3,
        rest_seconds: 75,
        notes: "60-90 seconds rest between sets",
      },
      exercises: [
        {
          exercise: "Kettlebell Windmill",
          position: 1,
          sets: 3,
          reps: 5,
          per_side: true,
          superset_group: "B",
          notes: "Half-kneeling",
        },
      ],
    },
  ]);

  // ─── Week 1, Workout 2 ──────────────────────────────────────

  seedRoutine("Week 1 – Workout 2", "KB On-Ramp: Swings, OH Press, Rows", [
    {
      section: {
        name: "Primer",
        format: "rounds",
        format_config: { rounds: 2 },
        position: 1,
      },
      exercises: [
        { exercise: "Kettlebell Drag", position: 1, reps: 5 },
        { exercise: "Kettlebell Swing", position: 2, reps: 5, per_side: true },
        {
          exercise: "Kettlebell Halo",
          position: 3,
          reps: 5,
          per_side: true,
          notes: "Each direction",
        },
      ],
    },
    {
      section: {
        name: "Part A",
        format: "rounds",
        format_config: { rounds: 4 },
        position: 2,
        rest_seconds: 75,
        notes: "Rest 60-90 seconds between supersets",
      },
      exercises: [
        {
          exercise: "Kettlebell Swing",
          position: 1,
          reps: 8,
          notes: "Left side",
        },
        {
          exercise: "Kettlebell Press",
          position: 2,
          reps: 8,
          notes: "Left side (OH Press)",
        },
        {
          exercise: "Kettlebell Swing",
          position: 3,
          reps: 8,
          notes: "Right side",
        },
        {
          exercise: "Kettlebell Press",
          position: 4,
          reps: 8,
          notes: "Right side (OH Press)",
        },
      ],
    },
    {
      section: {
        name: "Part B",
        format: "superset",
        position: 3,
        rest_seconds: 60,
        notes: "60 seconds rest between supersets",
      },
      exercises: [
        {
          exercise: "Slalom Hip Shift",
          position: 1,
          sets: 3,
          reps: 10,
          per_side: true,
          superset_group: "B",
          notes: "Or KB alternative",
        },
        {
          exercise: "Kettlebell Seesaw Row",
          position: 2,
          sets: 3,
          reps: 12,
          per_side: true,
          superset_group: "B",
        },
      ],
    },
  ]);

  // ─── Week 1, Workout 3 ──────────────────────────────────────

  seedRoutine(
    "Week 1 – Workout 3",
    "KB On-Ramp: Snatch Drill, Carries, TGU Intro",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 1 },
          position: 1,
          notes: "Complete once through",
        },
        exercises: [
          {
            exercise: "Kettlebell Sumo Deadlift",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Single arm",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "T-Plank Rotation",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Swing",
            position: 4,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            sets: 4,
            reps: 3,
            per_side: true,
            superset_group: "A",
            notes: "1 rep = all 3 positions",
          },
          {
            exercise: "Kettlebell Halo to Shoulder",
            position: 2,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Curtsy Lunge",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Goblet Carry",
            position: 2,
            sets: 3,
            duration_seconds: 90,
            superset_group: "B",
            notes: "Or 20-30s Goblet March",
          },
        ],
      },
      {
        section: {
          name: "Part D",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "TGU technique work — 60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to Tall-Sit",
            position: 1,
            sets: 3,
            reps: 5,
            per_side: true,
          },
        ],
      },
    ],
  );

  // ─── Week 2 ───────────────────────────────────────────────

  seedRoutine(
    "Week 2 – Workout 1",
    "KB On-Ramp: Cleans, Front Squats, EMOM (18 min)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell RDL", position: 1, reps: 5 },
          {
            exercise: "Kettlebell Clean",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Halo",
            position: 4,
            reps: 5,
            per_side: true,
            notes: "Each direction",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 18 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Kettlebell Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
            notes: "Left side",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            superset_group: "ODD",
            notes: "Left side",
          },
          {
            exercise: "Push-ups",
            position: 3,
            reps: 5,
            superset_group: "ODD",
            notes: "3-5 reps",
          },
          {
            exercise: "Kettlebell Clean",
            position: 4,
            reps: 3,
            superset_group: "EVEN",
            notes: "Right side",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 3,
            superset_group: "EVEN",
            notes: "Right side",
          },
          {
            exercise: "Push-ups",
            position: 6,
            reps: 5,
            superset_group: "EVEN",
            notes: "3-5 reps",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "straight",
          position: 3,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            sets: 3,
            reps: 5,
            per_side: true,
            superset_group: "B",
            notes: "Half-kneeling",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 2 – Workout 2",
    "KB On-Ramp: Swings, OH Press, Rows (progressive rounds)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell Drag", position: 1, reps: 5 },
          {
            exercise: "Kettlebell Swing",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Halo",
            position: 3,
            reps: 5,
            per_side: true,
            notes: "Each direction",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "rounds",
          format_config: { rounds: 4 },
          position: 2,
          rest_seconds: 75,
          notes:
            "First 2 rounds: 10 swings; Last 2 rounds: 8 swings. Rest 60-90s between supersets",
        },
        exercises: [
          {
            exercise: "Kettlebell Swing",
            position: 1,
            reps: 10,
            notes: "Left side; Last 2 rounds: 8 reps",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            reps: 8,
            notes: "Left side (OH Press)",
          },
          {
            exercise: "Kettlebell Swing",
            position: 3,
            reps: 10,
            notes: "Right side; Last 2 rounds: 8 reps",
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 8,
            notes: "Right side (OH Press)",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "Slalom Hip Shift",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "FSB or KB alternative",
          },
          {
            exercise: "Kettlebell Seesaw Row",
            position: 2,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "B",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 2 – Workout 3",
    "KB On-Ramp: Snatch Drill, Carries, TGU Technique",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 1 },
          position: 1,
          notes: "Complete once through",
        },
        exercises: [
          {
            exercise: "Kettlebell Sumo Deadlift",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Single arm",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "T-Plank Rotation",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Swing",
            position: 4,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            sets: 4,
            reps: 4,
            per_side: true,
            superset_group: "A",
            notes:
              "First 2 sets: 4 reps, Last 2 sets: 3 reps; 1 rep = all 3 positions",
          },
          {
            exercise: "Kettlebell Halo to Shoulder",
            position: 2,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "A",
            notes: "First 2 sets: 10 reps, Last 2 sets: 8 reps",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Curtsy Lunge",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Goblet Carry",
            position: 2,
            sets: 3,
            duration_seconds: 90,
            superset_group: "B",
            notes: "Or 20-30s Goblet March",
          },
        ],
      },
      {
        section: {
          name: "Part C",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to Tall-Sit",
            position: 1,
            sets: 3,
            reps: 5,
            per_side: true,
          },
        ],
      },
    ],
  );

  // ─── Week 3 ───────────────────────────────────────────────

  seedRoutine(
    "Week 3 – Workout 1",
    "KB On-Ramp: Cleans, Front Squats, EMOM (20 min)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell RDL", position: 1, reps: 5 },
          {
            exercise: "Kettlebell Clean",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Halo",
            position: 4,
            reps: 5,
            per_side: true,
            notes: "Each direction",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 20 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Kettlebell Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
            notes: "Left side",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            superset_group: "ODD",
            notes: "Left side",
          },
          {
            exercise: "Push-ups",
            position: 3,
            reps: 5,
            superset_group: "ODD",
            notes: "3-5 reps",
          },
          {
            exercise: "Kettlebell Clean",
            position: 4,
            reps: 3,
            superset_group: "EVEN",
            notes: "Right side",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 3,
            superset_group: "EVEN",
            notes: "Right side",
          },
          {
            exercise: "Push-ups",
            position: 6,
            reps: 5,
            superset_group: "EVEN",
            notes: "3-5 reps",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "straight",
          position: 3,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            sets: 4,
            reps: 4,
            per_side: true,
            superset_group: "B",
            notes: "Half-kneeling",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 3 – Workout 2",
    "KB On-Ramp: Swings, OH Press, Rows (4 rounds)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell Drag", position: 1, reps: 5 },
          {
            exercise: "Kettlebell Swing",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Halo",
            position: 3,
            reps: 5,
            per_side: true,
            notes: "Each direction",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "rounds",
          format_config: { rounds: 4 },
          position: 2,
          rest_seconds: 75,
          notes: "Rest 60-90 seconds between supersets",
        },
        exercises: [
          {
            exercise: "Kettlebell Swing",
            position: 1,
            reps: 10,
            notes: "Left side",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            reps: 8,
            notes: "Left side (OH Press)",
          },
          {
            exercise: "Kettlebell Swing",
            position: 3,
            reps: 10,
            notes: "Right side",
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 8,
            notes: "Right side (OH Press)",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "Slalom Hip Shift",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "FSB or KB alternative",
          },
          {
            exercise: "Kettlebell Seesaw Row",
            position: 2,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "B",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 3 – Workout 3",
    "KB On-Ramp: Snatch Drill, Carries, TGU (progressed)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 1 },
          position: 1,
          notes: "Complete once through",
        },
        exercises: [
          {
            exercise: "Kettlebell Sumo Deadlift",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Single arm",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "T-Plank Rotation",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Swing",
            position: 4,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            sets: 4,
            reps: 4,
            per_side: true,
            superset_group: "A",
            notes: "1 rep = all 3 positions",
          },
          {
            exercise: "Kettlebell Halo to Shoulder",
            position: 2,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "A",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Curtsy Lunge",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "First 2 sets: 8 reps, Last 2 sets: 6 reps",
          },
          {
            exercise: "Goblet Carry",
            position: 2,
            sets: 4,
            duration_seconds: 90,
            superset_group: "B",
            notes:
              "First 2 sets: 90', Last 2 sets: 60'; Or 20-30s Goblet March",
          },
        ],
      },
      {
        section: {
          name: "Part C",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to Tall-Sit",
            position: 1,
            sets: 3,
            reps: 5,
            per_side: true,
          },
        ],
      },
    ],
  );

  // ─── Week 4 (Deload) ──────────────────────────────────────

  seedRoutine(
    "Week 4 – Workout 1",
    "KB On-Ramp Deload: Cleans, Front Squats, EMOM (12 min)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell RDL", position: 1, reps: 5 },
          {
            exercise: "Kettlebell Clean",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Halo",
            position: 4,
            reps: 5,
            per_side: true,
            notes: "Each direction",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 12 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Kettlebell Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
            notes: "Left side",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            superset_group: "ODD",
            notes: "Left side",
          },
          {
            exercise: "Push-ups",
            position: 3,
            reps: 5,
            superset_group: "ODD",
            notes: "3-5 reps",
          },
          {
            exercise: "Kettlebell Clean",
            position: 4,
            reps: 3,
            superset_group: "EVEN",
            notes: "Right side",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 3,
            superset_group: "EVEN",
            notes: "Right side",
          },
          {
            exercise: "Push-ups",
            position: 6,
            reps: 5,
            superset_group: "EVEN",
            notes: "3-5 reps",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "straight",
          position: 3,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
            superset_group: "B",
            notes: "Half-kneeling",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 4 – Workout 2",
    "KB On-Ramp Deload: Swings, OH Press, Rows (3 rounds)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell Drag", position: 1, reps: 5 },
          {
            exercise: "Kettlebell Swing",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Halo",
            position: 3,
            reps: 5,
            per_side: true,
            notes: "Each direction",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "rounds",
          format_config: { rounds: 3 },
          position: 2,
          rest_seconds: 75,
          notes: "Rest 60-90 seconds between supersets",
        },
        exercises: [
          {
            exercise: "Kettlebell Swing",
            position: 1,
            reps: 6,
            notes: "Left side",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            reps: 6,
            notes: "Left side (OH Press)",
          },
          {
            exercise: "Kettlebell Swing",
            position: 3,
            reps: 6,
            notes: "Right side",
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 6,
            notes: "Right side (OH Press)",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "Slalom Hip Shift",
            position: 1,
            sets: 3,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "FSB or KB alternative",
          },
          {
            exercise: "Kettlebell Seesaw Row",
            position: 2,
            sets: 3,
            reps: 8,
            per_side: true,
            superset_group: "B",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 4 – Workout 3",
    "KB On-Ramp Deload: Snatch Drill, Carries, TGU",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 1 },
          position: 1,
          notes: "Complete once through",
        },
        exercises: [
          {
            exercise: "Kettlebell Sumo Deadlift",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Single arm",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "T-Plank Rotation",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Swing",
            position: 4,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 5,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between supersets",
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
            superset_group: "A",
            notes: "1 rep = all 3 positions",
          },
          {
            exercise: "Kettlebell Halo to Shoulder",
            position: 2,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "A",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Curtsy Lunge",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Goblet Carry",
            position: 2,
            sets: 3,
            duration_seconds: 60,
            superset_group: "B",
            notes: "Or 20s Goblet March",
          },
        ],
      },
      {
        section: {
          name: "Part D",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to Tall-Sit",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
          },
        ],
      },
    ],
  );

  // ─── Week 5 ───────────────────────────────────────────────

  seedRoutine(
    "Week 5 – Workout 1",
    "KB On-Ramp: Seesaw Press, Front Rack Lunges, Kickstand RDL",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Half-kneeling",
          },
          {
            exercise: "SA Front Rack Step-Back Lunge",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Slalom Hip Shift",
            position: 3,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Seesaw Press",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
            notes: "5-8 reps per side",
          },
          {
            exercise: "DBL KB Front Rack Step-Back Lunge",
            position: 2,
            sets: 4,
            reps: 6,
            per_side: true,
            superset_group: "A",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Farmer Grip Kickstand RDL",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Kettlebell Farmer's Carry",
            position: 2,
            sets: 3,
            duration_seconds: 90,
            superset_group: "B",
            notes: "90' carry or 30 second March in place",
          },
        ],
      },
      {
        section: {
          name: "Part C",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to High Hip Bridge",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 5 – Workout 2",
    "KB On-Ramp: DBL Cleans, Seesaw Press EMOM, Windmill Carry",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kang Squat", position: 1, reps: 5 },
          { exercise: "Kettlebell Halo", position: 2, reps: 5, per_side: true },
          {
            exercise: "Kettlebell Clean",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 3,
            per_side: true,
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 16 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Double KB Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
          },
          {
            exercise: "Seesaw Press",
            position: 2,
            reps: 3,
            per_side: true,
            superset_group: "ODD",
          },
          {
            exercise: "FSB Halos",
            position: 3,
            reps: 6,
            per_side: true,
            superset_group: "EVEN",
            notes: "Or KB halo alternative",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "rounds",
          format_config: { rounds: 3 },
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest per side",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "SA Front Rack Carry",
            position: 2,
            per_side: true,
            duration_seconds: 90,
            notes: "90' carry or 30 second March in place",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 5 – Workout 3",
    "KB On-Ramp: Half-Snatches, Cossack Squats",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            reps: 2,
            per_side: true,
          },
          {
            exercise: "SA Overhead March",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Pike Toe Taps",
            position: 3,
            reps: 6,
            per_side: true,
            notes: "Alternating",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "KB Half-Snatch",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Cossack Squat",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Steel Mace Stop & Go 360s",
            position: 2,
            sets: 3,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "Or KB alternative",
          },
        ],
      },
    ],
  );

  // ─── Week 6 ───────────────────────────────────────────────

  seedRoutine(
    "Week 6 – Workout 1",
    "KB On-Ramp: DBL Cleans, Seesaw Press EMOM (18 min), Windmill Carry",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kang Squat", position: 1, reps: 5 },
          { exercise: "Kettlebell Halo", position: 2, reps: 5, per_side: true },
          {
            exercise: "Kettlebell Clean",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 3,
            per_side: true,
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 18 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Double KB Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
          },
          {
            exercise: "Seesaw Press",
            position: 2,
            reps: 3,
            per_side: true,
            superset_group: "ODD",
          },
          {
            exercise: "FSB Halos",
            position: 3,
            reps: 6,
            per_side: true,
            superset_group: "EVEN",
            notes: "Or KB halo alternative",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "rounds",
          format_config: { rounds: 4 },
          position: 3,
          rest_seconds: 60,
          notes:
            "First 2 rounds: 90' carry; Last 2 rounds: 60' carry. 60 seconds rest per side",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 4,
            per_side: true,
          },
          {
            exercise: "SA Front Rack Carry",
            position: 2,
            per_side: true,
            duration_seconds: 90,
            notes:
              "First 2 rounds: 90', Last 2 rounds: 60'; or 30/20 second March",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 6 – Workout 2",
    "KB On-Ramp: DBL Cleans, Seesaw Press EMOM (18 min), Windmill Carry",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kang Squat", position: 1, reps: 5 },
          { exercise: "Kettlebell Halo", position: 2, reps: 5, per_side: true },
          {
            exercise: "Kettlebell Clean",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 3,
            per_side: true,
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 18 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Double KB Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
          },
          {
            exercise: "Seesaw Press",
            position: 2,
            reps: 3,
            per_side: true,
            superset_group: "ODD",
          },
          {
            exercise: "FSB Halos",
            position: 3,
            reps: 6,
            per_side: true,
            superset_group: "EVEN",
            notes: "Or KB halo alternative",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "rounds",
          format_config: { rounds: 4 },
          position: 3,
          rest_seconds: 60,
          notes:
            "First 2 rounds: 90' carry; Last 2 rounds: 60' carry. 60 seconds rest per side",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 4,
            per_side: true,
          },
          {
            exercise: "SA Front Rack Carry",
            position: 2,
            per_side: true,
            duration_seconds: 90,
            notes:
              "First 2 rounds: 90', Last 2 rounds: 60'; or 30/20 second March",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 6 – Workout 3",
    "KB On-Ramp: Half-Snatches (progressed), Cossack Squats",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            reps: 2,
            per_side: true,
          },
          {
            exercise: "SA Overhead March",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Pike Toe Taps",
            position: 3,
            reps: 6,
            per_side: true,
            notes: "Alternating",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "KB Half-Snatch",
            position: 1,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "A",
            notes: "First 2 sets: 10 reps, Last 2 sets: 8 reps",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Cossack Squat",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Steel Mace Stop & Go 360s",
            position: 2,
            sets: 3,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "Or KB alternative",
          },
        ],
      },
    ],
  );

  // ─── Week 7 ───────────────────────────────────────────────

  seedRoutine(
    "Week 7 – Workout 1",
    "KB On-Ramp: Seesaw Press, Front Rack Lunges (progressed), Kickstand RDL",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Half-kneeling",
          },
          {
            exercise: "SA Front Rack Step-Back Lunge",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Slalom Hip Shift",
            position: 3,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Seesaw Press",
            position: 1,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "A",
            notes: "6-10 reps per side",
          },
          {
            exercise: "DBL KB Front Rack Step-Back Lunge",
            position: 2,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Farmer Grip Kickstand RDL",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "First 2 sets: 8 reps, Last 2 sets: 6 reps",
          },
          {
            exercise: "Kettlebell Farmer's Carry",
            position: 2,
            sets: 4,
            duration_seconds: 90,
            superset_group: "B",
            notes: "90' carry or 30 second March in place",
          },
        ],
      },
      {
        section: {
          name: "Part C",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to High Hip Bridge",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 7 – Workout 2",
    "KB On-Ramp: DBL Cleans, Seesaw Press EMOM (20 min), Windmill Carry",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kang Squat", position: 1, reps: 5 },
          { exercise: "Kettlebell Halo", position: 2, reps: 5, per_side: true },
          {
            exercise: "Kettlebell Clean",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 3,
            per_side: true,
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 20 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Double KB Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
          },
          {
            exercise: "Seesaw Press",
            position: 2,
            reps: 3,
            per_side: true,
            superset_group: "ODD",
          },
          {
            exercise: "FSB Halos",
            position: 3,
            reps: 6,
            per_side: true,
            superset_group: "EVEN",
            notes: "Or KB halo alternative",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "rounds",
          format_config: { rounds: 4 },
          position: 3,
          rest_seconds: 60,
          notes:
            "First 2 rounds: 90' carry; Last 2 rounds: 60' carry. 60 seconds rest per side",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 4,
            per_side: true,
          },
          {
            exercise: "SA Front Rack Carry",
            position: 2,
            per_side: true,
            duration_seconds: 90,
            notes:
              "First 2 rounds: 90', Last 2 rounds: 60'; or 30/20 second March",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 7 – Workout 3",
    "KB On-Ramp: Half-Snatches, Cossack Squats (progressed)",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            reps: 2,
            per_side: true,
          },
          {
            exercise: "SA Overhead March",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Pike Toe Taps",
            position: 3,
            reps: 6,
            per_side: true,
            notes: "Alternating",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "KB Half-Snatch",
            position: 1,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "A",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "A",
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Cossack Squat",
            position: 1,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "First 2 sets: 8 reps, Last 2 sets: 6 reps",
          },
          {
            exercise: "Steel Mace Stop & Go 360s",
            position: 2,
            sets: 4,
            reps: 10,
            per_side: true,
            superset_group: "B",
            notes:
              "First 2 sets: 10 reps, Last 2 sets: 8 reps; Or KB alternative",
          },
        ],
      },
    ],
  );

  // ─── Week 8 (Deload) ──────────────────────────────────────────────

  seedRoutine(
    "Week 8 – Workout 1",
    "KB On-Ramp Deload: Seesaw Press, Front Rack Lunges, Kickstand RDL",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "Half-kneeling",
          },
          {
            exercise: "SA Front Rack Step-Back Lunge",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Slalom Hip Shift",
            position: 3,
            reps: 5,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Seesaw Press",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "A",
            notes: "4-6 reps per side",
          },
          {
            exercise: "DBL KB Front Rack Step-Back Lunge",
            position: 2,
            sets: 3,
            reps: 5,
            per_side: true,
            superset_group: "A",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Farmer Grip Kickstand RDL",
            position: 1,
            sets: 3,
            reps: 5,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Kettlebell Farmer's Carry",
            position: 2,
            sets: 3,
            duration_seconds: 60,
            superset_group: "B",
            notes: "60' carry or 20 second March in place",
          },
        ],
      },
      {
        section: {
          name: "Part C",
          format: "straight",
          position: 4,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "TGU Roll to High Hip Bridge",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 8 – Workout 2",
    "KB On-Ramp Deload: DBL Cleans, Seesaw Press EMOM (12 min), Windmill Carry",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kang Squat", position: 1, reps: 5 },
          { exercise: "Kettlebell Halo", position: 2, reps: 5, per_side: true },
          {
            exercise: "Kettlebell Clean",
            position: 3,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Press",
            position: 4,
            reps: 3,
            per_side: true,
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 12 },
          position: 2,
        },
        exercises: [
          {
            exercise: "Double KB Clean",
            position: 1,
            reps: 3,
            superset_group: "ODD",
          },
          {
            exercise: "Seesaw Press",
            position: 2,
            reps: 3,
            per_side: true,
            superset_group: "ODD",
          },
          {
            exercise: "FSB Halos",
            position: 3,
            reps: 3,
            per_side: true,
            superset_group: "EVEN",
            notes: "Or KB halo alternative",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "rounds",
          format_config: { rounds: 3 },
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest per side",
        },
        exercises: [
          {
            exercise: "Kettlebell Windmill",
            position: 1,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "SA Front Rack Carry",
            position: 2,
            per_side: true,
            duration_seconds: 60,
            notes: "60' carry or 20 second March in place",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 8 – Workout 3",
    "KB On-Ramp Deload: Half-Snatches, Cossack Squats",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
          notes: "Complete twice through",
        },
        exercises: [
          {
            exercise: "3-Position KB Snatch Drill",
            position: 1,
            reps: 2,
            per_side: true,
          },
          {
            exercise: "SA Overhead March",
            position: 2,
            reps: 3,
            per_side: true,
          },
          {
            exercise: "Pike Toe Taps",
            position: 3,
            reps: 6,
            per_side: true,
            notes: "Alternating",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "KB Half-Snatch",
            position: 1,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "A",
          },
          {
            exercise: "Kettlebell Press",
            position: 2,
            sets: 3,
            reps: 6,
            per_side: true,
            superset_group: "A",
            notes: "SA OH Press",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Goblet Cossack Squat",
            position: 1,
            sets: 3,
            reps: 3,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Steel Mace Stop & Go 360s",
            position: 2,
            sets: 3,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "Or KB alternative",
          },
        ],
      },
    ],
  );

  // ─── Week 9 ───────────────────────────────────────────────

  seedRoutine(
    "Week 9 – Workout 1",
    "KB On-Ramp: DBL KB EMOM, TGUs, Tabata Snatches",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          {
            exercise: "Kettlebell Clean",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "SA KB Cleans, right side first",
          },
          {
            exercise: "Kettlebell Front Squat",
            position: 2,
            reps: 3,
            per_side: true,
            notes: "SA KB Front Squats, right arm first",
          },
          {
            exercise: "Kettlebell Press",
            position: 3,
            reps: 5,
            per_side: true,
            notes: "SA OH Press, right arm first",
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "emom",
          format_config: { duration_minutes: 10 },
          position: 2,
        },
        exercises: [
          { exercise: "Double KB Clean", position: 1, reps: 3 },
          { exercise: "Double KB Thruster", position: 2, reps: 3 },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "straight",
          position: 3,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Kettlebell Turkish Get-Up",
            position: 1,
            sets: 4,
            reps: 1,
            per_side: true,
            notes: "Full TGU",
          },
        ],
      },
      {
        section: {
          name: "Part C",
          format: "tabata",
          format_config: { work_seconds: 20, rest_seconds: 10, rounds: 6 },
          position: 4,
          notes: "TABATA: 20 seconds work / 10 seconds rest",
        },
        exercises: [
          {
            exercise: "FSB Rotational Snatch",
            position: 1,
            duration_seconds: 20,
            notes: "OR KB Snatch alternative",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 9 – Workout 2",
    "KB On-Ramp: Snatches, Rows, Curtsy Lunges, Macebell",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 2 },
          position: 1,
        },
        exercises: [
          { exercise: "Kettlebell Drag", position: 1, reps: 5 },
          { exercise: "Kettlebell RDL", position: 2, reps: 5 },
          { exercise: "Kettlebell Swing", position: 3, reps: 5 },
          { exercise: "Kettlebell Halo", position: 4, reps: 5, per_side: true },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "rounds",
          format_config: { rounds: 4 },
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Kettlebell Snatch",
            position: 1,
            reps: 8,
            notes: "Left side",
          },
          {
            exercise: "Kettlebell Row",
            position: 2,
            reps: 10,
            notes: "SA Row, Left side",
          },
          {
            exercise: "Kettlebell Snatch",
            position: 3,
            reps: 8,
            notes: "Right side",
          },
          {
            exercise: "Kettlebell Row",
            position: 4,
            reps: 10,
            notes: "SA Row, Right side",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "superset",
          position: 3,
          rest_seconds: 60,
          notes: "60 seconds rest between rounds",
        },
        exercises: [
          {
            exercise: "Goblet Curtsy Lunge",
            position: 1,
            sets: 4,
            reps: 6,
            per_side: true,
            superset_group: "B",
          },
          {
            exercise: "Macebell 10 & 2s",
            position: 2,
            sets: 4,
            reps: 8,
            per_side: true,
            superset_group: "B",
            notes: "OR KB alternative",
          },
        ],
      },
    ],
  );

  seedRoutine(
    "Week 9 – Workout 3",
    "KB On-Ramp: Swing to Squat, Push Press, Single Leg RDL, Carries",
    [
      {
        section: {
          name: "Primer",
          format: "rounds",
          format_config: { rounds: 1 },
          position: 1,
          notes: "Complete once through",
        },
        exercises: [
          {
            exercise: "Kettlebell Swing",
            position: 1,
            reps: 5,
            per_side: true,
            notes: "SA KB Swings",
          },
          {
            exercise: "Bodyweight Curtsy Lunge",
            position: 2,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Windmill",
            position: 3,
            reps: 3,
            per_side: true,
          },
          { exercise: "KB Half-Snatch", position: 4, reps: 5, per_side: true },
          {
            exercise: "Goblet Curtsy Lunge",
            position: 5,
            reps: 5,
            per_side: true,
          },
          {
            exercise: "Kettlebell Windmill",
            position: 6,
            reps: 3,
            per_side: true,
          },
        ],
      },
      {
        section: {
          name: "Part A",
          format: "superset",
          position: 2,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "KB Swing to Goblet Squat",
            position: 1,
            sets: 4,
            reps: 10,
            superset_group: "A",
          },
          {
            exercise: "Double KB Push Press",
            position: 2,
            sets: 4,
            reps: 8,
            superset_group: "A",
            notes: "6-8 reps",
          },
        ],
      },
      {
        section: {
          name: "Part B",
          format: "rounds",
          format_config: { rounds: 3 },
          position: 3,
          rest_seconds: 75,
          notes: "60-90 seconds rest between sets",
        },
        exercises: [
          {
            exercise: "Single Leg RDL",
            position: 1,
            reps: 6,
            notes: "Left side",
          },
          {
            exercise: "KB Suitcase Carry",
            position: 2,
            duration_seconds: 90,
            notes: "Left hand, OR 30 sec March in Place",
          },
          {
            exercise: "Single Leg RDL",
            position: 3,
            reps: 6,
            notes: "Right side",
          },
          {
            exercise: "KB Suitcase Carry",
            position: 4,
            duration_seconds: 90,
            notes: "Right hand, OR 30 sec March in Place",
          },
        ],
      },
    ],
  );

  // ─── Schedule Workouts ───────────────────────────────────────────

  const scheduleRoutine = db.prepare(
    "INSERT OR IGNORE INTO scheduled_routines (routine_id, date, notes) VALUES (?, ?, ?)",
  );

  function scheduleByName(name: string, date: string, notes: string) {
    const row = db
      .prepare("SELECT id FROM routines WHERE name = ?")
      .get(name) as { id: number } | undefined;
    if (!row) {
      console.log(`  Routine "${name}" not found, skipping schedule`);
      return;
    }
    scheduleRoutine.run(row.id, date, notes);
    console.log(`✓ Scheduled "${name}" for ${date}`);
  }

  // Week 8 workouts
  scheduleByName(
    "Week 8 – Workout 1",
    "2026-03-03",
    "KB On-Ramp — Week 8, Day 1",
  );
  scheduleByName(
    "Week 8 – Workout 2",
    "2026-03-05",
    "KB On-Ramp — Week 8, Day 2",
  );
  scheduleByName(
    "Week 8 – Workout 3",
    "2026-03-07",
    "KB On-Ramp — Week 8, Day 3",
  );

  // Week 9 workouts
  scheduleByName(
    "Week 9 – Workout 1",
    "2026-03-09",
    "KB On-Ramp — Week 9, Day 1",
  );
  scheduleByName(
    "Week 9 – Workout 2",
    "2026-03-11",
    "KB On-Ramp — Week 9, Day 2",
  );
  scheduleByName(
    "Week 9 – Workout 3",
    "2026-03-13",
    "KB On-Ramp — Week 9, Day 3",
  );
});

seedAll();

console.log("\n✅ Seed complete!");
