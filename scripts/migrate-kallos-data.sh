#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATION_FILE="${KALLOS_MIGRATION_FILE:-$ROOT_DIR/migrations/kallos-production.db}"
COMPOSE_FILE="$ROOT_DIR/apps/kallos-sthenos/docker-compose.yml"
APPLIED_DIR="$ROOT_DIR/migrations/applied"

if [[ ! -e "$MIGRATION_FILE" ]]; then
  echo "No staged Kallos data migration found; skipping."
  exit 0
fi

if [[ ! -f "$MIGRATION_FILE" || ! -s "$MIGRATION_FILE" ]]; then
  echo "Kallos data migration must be a nonempty file: $MIGRATION_FILE" >&2
  exit 1
fi

MIGRATION_FILE="$MIGRATION_FILE" pnpm --dir "$ROOT_DIR" \
  --filter @waxeccentric/kallos-sthenos exec node <<'NODE'
const Database = require("better-sqlite3");

const database = new Database(process.env.MIGRATION_FILE, {
  fileMustExist: true,
  readonly: true,
});

try {
  const result = database.pragma("integrity_check", { simple: true });
  if (result !== "ok") {
    throw new Error(`SQLite integrity check failed: ${result}`);
  }
} finally {
  database.close();
}
NODE

rm -f "$MIGRATION_FILE-wal" "$MIGRATION_FILE-shm"
echo "Validated Kallos data migration: $MIGRATION_FILE"

docker compose -f "$COMPOSE_FILE" build app
docker compose -f "$COMPOSE_FILE" down

restart_required=true
trap 'if [[ "$restart_required" == true ]]; then docker compose -f "$COMPOSE_FILE" up -d app; fi' EXIT

timestamp="$(date +%Y%m%d-%H%M%S)"

docker compose -f "$COMPOSE_FILE" run --rm --no-deps --user root \
  -v "$MIGRATION_FILE:/tmp/kallos-production.db:ro" \
  app sh -c '
    set -eu
    timestamp="$1"
    backup_dir="/app/data/migration-backups/$timestamp"

    if [ -e /app/data/kallos.db ] || [ -e /app/data/kallos.db-wal ] || [ -e /app/data/kallos.db-shm ]; then
      mkdir -p "$backup_dir"
      for file in kallos.db kallos.db-wal kallos.db-shm; do
        if [ -e "/app/data/$file" ]; then
          cp -p "/app/data/$file" "$backup_dir/$file"
        fi
      done
    fi

    cp /tmp/kallos-production.db /app/data/kallos.db.importing
    chown 1001:1001 /app/data/kallos.db.importing
    chmod 660 /app/data/kallos.db.importing
    rm -f /app/data/kallos.db-wal /app/data/kallos.db-shm
    mv /app/data/kallos.db.importing /app/data/kallos.db
  ' sh "$timestamp"

docker compose -f "$COMPOSE_FILE" up -d app
restart_required=false
trap - EXIT

mkdir -p "$APPLIED_DIR"
mv "$MIGRATION_FILE" "$APPLIED_DIR/kallos-production-$timestamp.db"

echo "Kallos data migration applied and archived under $APPLIED_DIR."
