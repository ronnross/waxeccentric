import { getDb } from "./connection";

export function migrate() {
  const db = getDb();

  db.pragma("foreign_keys = OFF");
  db.exec("BEGIN IMMEDIATE");

  try {
    db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      category TEXT,
      muscle_group TEXT,
      equipment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS routine_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT 'straight' CHECK (format IN ('straight', 'rounds', 'emom', 'superset', 'tabata', 'warm-up', 'cool-down')),
      format_config TEXT,
      position INTEGER NOT NULL,
      rest_seconds INTEGER,
      notes TEXT,
      UNIQUE (routine_id, position)
    );

    CREATE TABLE IF NOT EXISTS routine_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL REFERENCES routine_sections(id) ON DELETE CASCADE,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
      position INTEGER NOT NULL,
      superset_group TEXT,
      per_side INTEGER NOT NULL DEFAULT 0,
      sets INTEGER,
      reps INTEGER,
      duration_seconds INTEGER,
      rest_seconds INTEGER,
      notes TEXT,
      UNIQUE (section_id, position)
    );

    CREATE TABLE IF NOT EXISTS scheduled_routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE (routine_id, date)
    );
  `);

    // Grease the Groove tables
    db.exec(`
    CREATE TABLE IF NOT EXISTS gtg_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
      daily_goal INTEGER NOT NULL,
      reps_per_set INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gtg_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER NOT NULL REFERENCES gtg_programs(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      logged_at TEXT DEFAULT (datetime('now'))
    );
  `);

    // Add rating column to scheduled_routines if it doesn't exist
    const srCols = db
      .prepare("PRAGMA table_info(scheduled_routines)")
      .all() as {
      name: string;
    }[];
    if (!srCols.some((c) => c.name === "rating")) {
      db.exec("ALTER TABLE scheduled_routines ADD COLUMN rating INTEGER");
    }

    // Add video_url column if it doesn't exist yet
    const cols = db.prepare("PRAGMA table_info(exercises)").all() as {
      name: string;
    }[];
    if (!cols.some((c) => c.name === "video_url")) {
      db.exec("ALTER TABLE exercises ADD COLUMN video_url TEXT");
    }
    if (!cols.some((c) => c.name === "image_url")) {
      db.exec("ALTER TABLE exercises ADD COLUMN image_url TEXT");
    }

    // Add rir and priority columns to routine_exercises if they don't exist
    const reCols = db.prepare("PRAGMA table_info(routine_exercises)").all() as {
      name: string;
    }[];
    if (!reCols.some((c) => c.name === "rir")) {
      db.exec("ALTER TABLE routine_exercises ADD COLUMN rir INTEGER");
    }
    if (!reCols.some((c) => c.name === "priority")) {
      db.exec(
        "ALTER TABLE routine_exercises ADD COLUMN priority INTEGER NOT NULL DEFAULT 0",
      );
    }

    // Workout logs for progressive overload tracking
    db.exec(`
    CREATE TABLE IF NOT EXISTS workout_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      schedule_id INTEGER NOT NULL REFERENCES scheduled_routines(id) ON DELETE CASCADE,
      routine_exercise_id INTEGER NOT NULL REFERENCES routine_exercises(id) ON DELETE CASCADE,
      set_number INTEGER NOT NULL,
      weight REAL,
      reps INTEGER,
      rir INTEGER,
      notes TEXT,
      logged_at TEXT DEFAULT (datetime('now'))
    );
  `);

    // Migrate muscle_group values to ACSM categories
    const needsMigration = db
      .prepare(
        "SELECT COUNT(*) as cnt FROM exercises WHERE muscle_group IN ('chest', 'back', 'shoulders', 'arms', 'legs', 'glutes', 'upper body')",
      )
      .get() as { cnt: number };
    if (needsMigration.cnt > 0) {
      db.exec(`
      UPDATE exercises SET muscle_group = 'upper push' WHERE muscle_group IN ('chest', 'shoulders', 'arms', 'upper body');
      UPDATE exercises SET muscle_group = 'upper pull' WHERE muscle_group = 'back';
      UPDATE exercises SET muscle_group = 'lower' WHERE muscle_group IN ('legs', 'glutes');
    `);
    }

    // Migrate routine_sections CHECK constraint to include 'tabata' format
    // SQLite can't ALTER CHECK constraints, so we recreate the table if needed.
    // IMPORTANT: Disable foreign keys during table recreation to prevent CASCADE deletes.
    const tableInfo = db
      .prepare(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='routine_sections'",
      )
      .get() as { sql: string } | undefined;
    if (tableInfo && !tableInfo.sql.includes("'warm-up'")) {
      db.pragma("foreign_keys = OFF");
      db.exec(`
      CREATE TABLE routine_sections_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT 'straight' CHECK (format IN ('straight', 'rounds', 'emom', 'superset', 'tabata', 'warm-up', 'cool-down', 'ladder')),
        format_config TEXT,
        position INTEGER NOT NULL,
        rest_seconds INTEGER,
        notes TEXT,
        UNIQUE (routine_id, position)
      );
      INSERT INTO routine_sections_new SELECT * FROM routine_sections;
      DROP TABLE routine_sections;
      ALTER TABLE routine_sections_new RENAME TO routine_sections;
    `);
      db.pragma("foreign_keys = ON");
    }

    // Add 'ladder' to routine_sections CHECK constraint if not present
    const tableInfo2 = db
      .prepare(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='routine_sections'",
      )
      .get() as { sql: string } | undefined;
    if (tableInfo2 && !tableInfo2.sql.includes("'ladder'")) {
      db.pragma("foreign_keys = OFF");
      db.exec(`
      CREATE TABLE routine_sections_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT 'straight' CHECK (format IN ('straight', 'rounds', 'emom', 'superset', 'tabata', 'warm-up', 'cool-down', 'ladder')),
        format_config TEXT,
        position INTEGER NOT NULL,
        rest_seconds INTEGER,
        notes TEXT,
        UNIQUE (routine_id, position)
      );
      INSERT INTO routine_sections_new SELECT * FROM routine_sections;
      DROP TABLE routine_sections;
      ALTER TABLE routine_sections_new RENAME TO routine_sections;
    `);
      db.pragma("foreign_keys = ON");
    }

    // Add reps_ladder column to routine_exercises if it doesn't exist
    const reCols2 = db
      .prepare("PRAGMA table_info(routine_exercises)")
      .all() as {
      name: string;
    }[];
    if (!reCols2.some((c) => c.name === "reps_ladder")) {
      db.exec("ALTER TABLE routine_exercises ADD COLUMN reps_ladder TEXT");
    }

    db.exec("COMMIT");
  } catch (error) {
    if (db.inTransaction) db.exec("ROLLBACK");
    throw error;
  } finally {
    db.pragma("foreign_keys = ON");
  }
}
