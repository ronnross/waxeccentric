import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const projectRoot = process.cwd();
const dbPath = path.join(projectRoot, "data", "kallos.db");
const backupDir = path.join(projectRoot, "backups");

function formatTimestamp(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

async function main() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found: ${dbPath}`);
  }

  fs.mkdirSync(backupDir, { recursive: true });

  const outputArg = process.argv[2];
  const outputPath = outputArg
    ? path.resolve(projectRoot, outputArg)
    : path.join(backupDir, `kallos-${formatTimestamp(new Date())}.db`);

  if (fs.existsSync(outputPath)) {
    throw new Error(`Backup already exists: ${outputPath}`);
  }

  const db = new Database(dbPath, { fileMustExist: true });

  try {
    // A passive checkpoint helps fold recent WAL pages into the main file.
    db.pragma("wal_checkpoint(PASSIVE)");
    await db.backup(outputPath);
  } finally {
    db.close();
  }

  console.log(`Backup created at: ${outputPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Backup failed: ${message}`);
  process.exit(1);
});
