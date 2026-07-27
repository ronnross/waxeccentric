import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DB_PATH =
  process.env.KALLOS_DB_PATH ?? path.join(process.cwd(), "data", "kallos.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("busy_timeout = 10000");
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}
