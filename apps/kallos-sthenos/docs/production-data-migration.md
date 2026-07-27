# Production Data Migration

This runbook migrates an existing local Kallos Sthenos SQLite database to a
production Docker deployment.

## Data Paths

The local database is:

```text
apps/kallos-sthenos/data/kallos.db
```

The repository Compose configuration bind-mounts that directory into the
container:

```text
apps/kallos-sthenos/data -> /app/data
```

If production uses an external persistent directory such as
`/opt/kallos-sthenos/data` or a Coolify-managed volume, keep that directory
mounted at `/app/data`. The deployment hook operates through the container
mount, so no path substitution is required.

## Important Safety Rules

- Do not commit the database or a backup to Git.
- Do not copy a live `kallos.db` file directly. The application uses SQLite WAL
  mode, so committed data may still be held in `kallos.db-wal`.
- Create the transfer file with the provided backup command, which uses
  SQLite's online backup API.
- Stop production before replacing its database.
- Back up any existing production database before importing local data.

## 1. Create A Local Snapshot

From the repository root on the local machine:

```bash
cd apps/kallos-sthenos
pnpm db:backup backups/kallos-production.db
```

The local application may remain running while this command executes.

If the `sqlite3` command is installed, verify the snapshot before transfer:

```bash
sqlite3 backups/kallos-production.db "PRAGMA integrity_check;"
```

The expected result is:

```text
ok
```

## 2. Stage The Snapshot On Production

Create the migration staging directory on the production server:

```bash
ssh user@server 'mkdir -p ~/apps/waxeccentric/migrations'
```

Transfer the snapshot into that directory:

```bash
scp backups/kallos-production.db \
  user@server:~/apps/waxeccentric/migrations/kallos-production.db
```

The local backup and production staging directory are ignored by Git. The
snapshot still contains all application data and should be treated as
sensitive.

## 3. Run Deployment

Connect to the production server and enter the repository:

```bash
ssh user@server
cd ~/apps/waxeccentric
```

Run the normal deployment command:

```bash
pnpm run deploy:static
```

When `migrations/kallos-production.db` exists, deployment automatically:

1. Validates the staged database with `PRAGMA integrity_check` and rejects
  snapshots with no exercises or routines.
2. Builds the Kallos container before interrupting production.
3. Stops the Kallos container.
4. Copies any existing database and WAL files into a timestamped directory
   under `apps/kallos-sthenos/data/migration-backups`.
5. Imports the staged database with the required container ownership.
6. Starts Kallos again.
7. Verifies the imported exercises and routines inside the running container.
8. Moves the consumed snapshot under `migrations/applied` so later deployments
   cannot apply it again.

Watch the logs after deployment:

```bash
docker compose -f apps/kallos-sthenos/docker-compose.yml logs --tail=100 app
```

The application runs schema migrations automatically when it opens the imported
database. If no staged snapshot exists, the migration hook exits without
touching Docker or production data.

## 4. Verify The Migration

Check the local production endpoint:

```bash
curl --fail http://127.0.0.1:3000/kallos-sthenos/api/exercises
```

Then open the public application and verify that exercises, routines, schedule
entries, workout logs, and GTG data are present.

Optionally verify SQLite inside the running container:

```bash
docker compose -f apps/kallos-sthenos/docker-compose.yml exec app \
  node -e 'const Database=require("better-sqlite3"); const db=new Database("/app/data/kallos.db",{readonly:true}); console.log(db.pragma("integrity_check")); db.close();'
```

The integrity result should contain `ok`. The deployment hook has already moved
the staged file out of the incoming path.

The local backup may be retained securely or removed:

```bash
rm apps/kallos-sthenos/backups/kallos-production.db
```

## Rollback

If verification fails:

1. Stop the application with `docker compose down`.
2. Remove the imported `kallos.db`, `kallos.db-wal`, and `kallos.db-shm` files.
3. Copy the files from the latest timestamped directory under
  `apps/kallos-sthenos/data/migration-backups` back into the data directory.
4. Restore ownership to UID/GID `1001`.
5. Start the application and verify the previous data.

## Future Deployments

This import is normally required only once. The production bind mount or
managed volume persists `/app/data` independently of image rebuilds and source
code deployments. Do not overwrite the production database during routine
application deployments.
