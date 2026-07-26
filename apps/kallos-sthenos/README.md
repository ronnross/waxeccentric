# Kallos Sthenos

A personal workout planning app built with Next.js. Create exercises, compose them into structured routines with sections (warm-up, workout, cool-down, EMOM, Tabata, supersets), schedule routines on a calendar, and track daily reps with Grease the Groove.

## Tech Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**
- **SQLite** via `better-sqlite3`
- **Plain CSS** with custom properties (mobile-first)
- **Zod** for validation
- **Vitest** + React Testing Library for tests

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Seed the Database (optional)

```bash
npm run seed
```

The SQLite database is created automatically at `data/kallos.db` on first run. Migrations run on startup.

### Development

```bash
npm run dev
```

Opens on `http://localhost:3000` (auto-finds a free port if 3000 is taken).

### Run Tests

```bash
npm test          # watch mode
npm run test:run  # single run
npm run test:coverage
```

### Lint & Format

```bash
npm run lint
npm run format
npm run check     # lint + format in one pass
```

### Build for Production

```bash
npm run build
npm start
```

## Docker

The app includes a Dockerfile and docker-compose for self-hosting.

```bash
npm run docker:up     # build image & start container
npm run docker:down   # stop container
npm run docker:build  # build image only
```

The container bind-mounts `./data` so it uses your local SQLite database directly. The app runs on port 3000.

## Database

SQLite with WAL mode. The database file lives at `data/kallos.db` and is git-ignored.

```bash
npm run db:backup   # snapshot to backups/
npm run seed        # seed with sample data
```

## Project Structure

```
app/              Next.js pages and API routes
  api/            REST API (exercises, routines, schedule, gtg)
  exercises/      Exercise library UI
  routines/       Routine builder UI
  schedule/       Calendar scheduling UI
  gtg/            Grease the Groove tracker
components/       Shared React components
lib/
  db/             Database connection, migrations, queries
  schemas/        Zod validation schemas
  utils.ts        Shared utility functions
styles/           CSS (globals, layout, components, theme)
scripts/          CLI scripts (seed, backup, port finder)
public/           Static assets (service worker, icons)
test/             Test setup
```
