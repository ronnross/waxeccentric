# Kallos Sthenos — Product Requirements Document

## 1. Overview

**Kallos Sthenos** is a personal workout planning application that allows users to create and manage a library of exercises, compose them into structured routines (warm-up, workout, cool-down), and schedule those routines on specific dates. When a scheduled day arrives, the planned routine is surfaced automatically.

**Tech Stack:**

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router, React 19, Turbopack) |
| Language | **TypeScript** |
| Database | **SQLite** via `better-sqlite3` |
| Styling | **Plain CSS** with custom properties (mobile-first) |
| PWA | **`@ducanh2912/next-pwa`** (service worker + web app manifest) |
| Validation | **Zod** (shared schemas for API & forms) |
| Runtime | **Node.js 22.13+** |

---

## 2. Goals

- Deliver a **mobile-first Progressive Web App** that is installable on phones and desktops.
- Provide a simple, fast API for managing exercises and routines via **Next.js Route Handlers**.
- Support structured routines with three distinct phases: **warm-up**, **workout**, and **cool-down**.
- Allow routines to be scheduled on future dates so they appear when the day comes.
- Keep the system lightweight and self-contained — single process, single SQLite file, no external services.

---

## 3. Core Concepts

| Concept | Description |
|---|---|
| **Exercise** | A single movement or activity (e.g., "Barbell Squat", "Jump Rope"). |
| **Routine** | A named collection of exercises divided into warm-up, workout, and cool-down phases. |
| **Routine Exercise** | A join record linking an exercise to a routine with phase, order, sets, reps, duration, and notes. |
| **Schedule** | A mapping of a routine to a specific calendar date. |

---

## 4. Data Model

### 4.1 `exercises`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, autoincrement | Unique identifier |
| `name` | TEXT | NOT NULL, UNIQUE | Exercise name |
| `description` | TEXT | | How to perform the exercise |
| `category` | TEXT | | e.g., strength, cardio, mobility, stretching |
| `muscle_group` | TEXT | | Primary muscle group targeted |
| `equipment` | TEXT | | Equipment needed (or "none") |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### 4.2 `routines`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, autoincrement | Unique identifier |
| `name` | TEXT | NOT NULL | Routine name (e.g., "Upper Body A") |
| `description` | TEXT | | Notes about the routine |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |

### 4.3 `routine_exercises`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, autoincrement | Unique identifier |
| `routine_id` | INTEGER | FK → routines.id, NOT NULL | Parent routine |
| `exercise_id` | INTEGER | FK → exercises.id, NOT NULL | Linked exercise |
| `phase` | TEXT | NOT NULL, CHECK IN ('warm-up','workout','cool-down') | Routine phase |
| `position` | INTEGER | NOT NULL | Order within the phase |
| `sets` | INTEGER | | Number of sets |
| `reps` | INTEGER | | Reps per set |
| `duration_seconds` | INTEGER | | Duration in seconds (for timed exercises) |
| `rest_seconds` | INTEGER | | Rest between sets |
| `notes` | TEXT | | Per-exercise notes (e.g., "use light weight") |

**Unique constraint:** (`routine_id`, `phase`, `position`)

### 4.4 `scheduled_routines`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, autoincrement | Unique identifier |
| `routine_id` | INTEGER | FK → routines.id, NOT NULL | Routine to perform |
| `date` | TEXT | NOT NULL (ISO 8601 `YYYY-MM-DD`) | Scheduled date |
| `completed` | INTEGER | DEFAULT 0 | 0 = pending, 1 = completed |
| `notes` | TEXT | | Day-specific notes |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | |

**Unique constraint:** (`routine_id`, `date`) — prevent duplicate scheduling of the same routine on the same day.

---

## 5. API Design (Next.js Route Handlers)

All API routes live under `app/api/` using the Next.js App Router convention. Each route file exports named functions matching HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

Base path: `/api`

### 5.1 Exercises

| Method | Route Handler File | Description |
|---|---|---|
| `GET` | `app/api/exercises/route.ts` | List all exercises. Supports `?category=` and `?muscle_group=` query filters. |
| `POST` | `app/api/exercises/route.ts` | Create a new exercise. |
| `GET` | `app/api/exercises/[id]/route.ts` | Get a single exercise by ID. |
| `PUT` | `app/api/exercises/[id]/route.ts` | Update an exercise. |
| `DELETE` | `app/api/exercises/[id]/route.ts` | Delete an exercise (fails if referenced by a routine). |

### 5.2 Routines

| Method | Route Handler File | Description |
|---|---|---|
| `GET` | `app/api/routines/route.ts` | List all routines (summary). |
| `POST` | `app/api/routines/route.ts` | Create a routine (name, description). |
| `GET` | `app/api/routines/[id]/route.ts` | Get a routine with its exercises grouped by phase. |
| `PUT` | `app/api/routines/[id]/route.ts` | Update routine metadata. |
| `DELETE` | `app/api/routines/[id]/route.ts` | Delete a routine and its exercise associations. |

### 5.3 Routine Exercises

| Method | Route Handler File | Description |
|---|---|---|
| `POST` | `app/api/routines/[id]/exercises/route.ts` | Add an exercise to a routine (phase, position, sets, reps, etc.). |
| `PUT` | `app/api/routines/[routineId]/exercises/[id]/route.ts` | Update an exercise entry within a routine. |
| `DELETE` | `app/api/routines/[routineId]/exercises/[id]/route.ts` | Remove an exercise from a routine. |

### 5.4 Schedule

| Method | Route Handler File | Description |
|---|---|---|
| `GET` | `app/api/schedule/route.ts` | Query by `?date=YYYY-MM-DD` or `?from=...&to=...`. Returns full routine detail. |
| `POST` | `app/api/schedule/route.ts` | Schedule a routine on a date (`{ routine_id, date }`). |
| `PATCH` | `app/api/schedule/[id]/route.ts` | Update a scheduled entry (e.g., mark as completed, add notes). |
| `DELETE` | `app/api/schedule/[id]/route.ts` | Remove a scheduled routine. |

### 5.5 Today (convenience)

| Method | Route Handler File | Description |
|---|---|---|
| `GET` | `app/api/today/route.ts` | Get all routines scheduled for today with full exercise details grouped by phase. |

---

## 6. Response Shapes

### 6.1 Exercise

```json
{
  "id": 1,
  "name": "Barbell Squat",
  "description": "Stand with feet shoulder-width apart…",
  "category": "strength",
  "muscle_group": "legs",
  "equipment": "barbell",
  "created_at": "2026-02-16T10:00:00Z",
  "updated_at": "2026-02-16T10:00:00Z"
}
```

### 6.2 Routine (detailed)

```json
{
  "id": 1,
  "name": "Upper Body A",
  "description": "Push-focused upper body day",
  "phases": {
    "warm-up": [
      {
        "id": 10,
        "exercise": { "id": 3, "name": "Arm Circles" },
        "position": 1,
        "sets": 2,
        "reps": 15,
        "duration_seconds": null,
        "rest_seconds": null,
        "notes": null
      }
    ],
    "workout": [ /* … */ ],
    "cool-down": [ /* … */ ]
  }
}
```

### 6.3 Today / Schedule

```json
[
  {
    "schedule_id": 5,
    "date": "2026-02-16",
    "completed": false,
    "notes": null,
    "routine": { /* full routine object with phases */ }
  }
]
```

---

## 7. Project Structure

```
kallos-sthenos/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (HTML shell, metadata, nav)
│   ├── page.tsx                  # Home / "Today" view
│   ├── manifest.ts               # PWA web app manifest (dynamic)
│   ├── exercises/
│   │   ├── page.tsx              # Exercise library list
│   │   ├── new/page.tsx          # Create exercise form
│   │   └── [id]/
│   │       ├── page.tsx          # Exercise detail / edit
│   ├── routines/
│   │   ├── page.tsx              # Routine list
│   │   ├── new/page.tsx          # Create routine form
│   │   └── [id]/
│   │       ├── page.tsx          # Routine detail (phases view)
│   │       └── edit/page.tsx     # Edit routine + manage exercises
│   ├── schedule/
│   │   └── page.tsx              # Calendar / schedule view
│   └── api/                      # API Route Handlers
│       ├── exercises/
│       │   ├── route.ts          # GET (list), POST (create)
│       │   └── [id]/route.ts     # GET, PUT, DELETE
│       ├── routines/
│       │   ├── route.ts          # GET (list), POST (create)
│       │   └── [id]/
│       │       ├── route.ts      # GET, PUT, DELETE
│       │       └── exercises/
│       │           ├── route.ts  # POST (add exercise to routine)
│       │           └── [exerciseId]/route.ts  # PUT, DELETE
│       ├── schedule/
│       │   ├── route.ts          # GET (query), POST (schedule)
│       │   └── [id]/route.ts     # PATCH, DELETE
│       └── today/
│           └── route.ts          # GET
├── lib/
│   ├── db/
│   │   ├── connection.ts         # SQLite singleton (better-sqlite3)
│   │   ├── migrate.ts            # Schema creation / migrations
│   │   └── queries/
│   │       ├── exercises.ts      # Exercise query functions
│   │       ├── routines.ts       # Routine query functions
│   │       └── schedule.ts       # Schedule query functions
│   ├── schemas/
│   │   ├── exercise.ts           # Zod schemas for exercise validation
│   │   ├── routine.ts            # Zod schemas for routine validation
│   │   └── schedule.ts           # Zod schemas for schedule validation
│   └── utils.ts                  # Shared helpers (date formatting, etc.)
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   ├── ExerciseCard.tsx
│   ├── RoutinePhaseList.tsx
│   ├── ScheduleCalendar.tsx
│   ├── TodayRoutine.tsx
│   └── Nav.tsx                   # Bottom tab navigation (mobile)
├── public/
│   ├── icons/                    # PWA icons (192×192, 512×512, maskable)
│   └── sw.js                     # Generated service worker (output)
├── styles/
│   ├── globals.css               # CSS custom properties, resets, base
│   ├── layout.css                # Shell layout, nav, responsive grid
│   └── components.css            # Component-specific styles
├── data/
│   └── kallos.db                 # SQLite database file (gitignored)
├── next.config.ts                # Next.js + PWA plugin config
├── package.json
├── tsconfig.json
├── .gitignore
└── PRD.md
```

---

## 8. Progressive Web App (PWA)

### 8.1 Strategy

**Online-only with install support.** The app shell and static assets are cached for fast repeat loads, but data operations require a network connection to the server. This keeps v1 simple — no IndexedDB sync, no conflict resolution.

### 8.2 Manifest

Generated dynamically via `app/manifest.ts`:

| Property | Value |
|---|---|
| `name` | Kallos Sthenos |
| `short_name` | Kallos |
| `start_url` | `/` |
| `display` | `standalone` |
| `theme_color` | (primary brand color) |
| `background_color` | (background color) |
| `icons` | 192×192, 512×512 (+ maskable variants) |

### 8.3 Service Worker

- Generated by `@ducanh2912/next-pwa` wrapping Workbox.
- **Precaches** the app shell (HTML, CSS, JS bundles).
- **Runtime caching** for API responses is **network-first** — always fetch fresh data, fall back to showing a generic offline message if unreachable.
- No background sync or push notifications in v1.

### 8.4 Install Prompt

- The app meets Chrome/Safari install criteria automatically (manifest + service worker + HTTPS).
- No custom install banner in v1; relies on the browser's native "Add to Home Screen" UI.

---

## 9. Frontend Architecture

### 9.1 Mobile-First Design

- **Viewport-first layout:** All pages designed for 375px and up, scaling gracefully to tablet/desktop.
- **Bottom tab navigation:** Primary nav (Today, Exercises, Routines, Schedule) as a fixed bottom bar — thumb-friendly on phones.
- **Touch targets:** Minimum 44×44px tap targets per Apple HIG.
- **Responsive breakpoints:**
  - `< 640px` — single column, bottom nav
  - `640px–1024px` — two-column grid, bottom nav
  - `> 1024px` — three-column grid, sidebar nav

### 9.2 CSS Architecture

**Plain CSS with custom properties.** No preprocessor, no CSS-in-JS.

```css
/* styles/globals.css — design tokens */
:root {
  --color-primary: #4f46e5;
  --color-primary-light: #818cf8;
  --color-surface: #ffffff;
  --color-background: #f8fafc;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-success: #10b981;
  --color-danger: #ef4444;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  --font-sans: system-ui, -apple-system, sans-serif;
  --nav-height: 64px;
}
```

### 9.3 Key Pages

| Route | Page | Description |
|---|---|---|
| `/` | Today | Shows today's scheduled routines with exercises grouped by phase. Hero state if nothing scheduled. |
| `/exercises` | Exercise Library | Filterable list/grid of all exercises. |
| `/exercises/new` | New Exercise | Form to create an exercise. |
| `/exercises/[id]` | Exercise Detail | View/edit a single exercise. |
| `/routines` | Routine List | All routines as cards. |
| `/routines/new` | New Routine | Form to name/describe a routine. |
| `/routines/[id]` | Routine Detail | Full routine view with warm-up → workout → cool-down phases. |
| `/routines/[id]/edit` | Edit Routine | Add/remove/reorder exercises within phases. |
| `/schedule` | Schedule | Calendar view showing scheduled routines. Tap a date to add/view. |

### 9.4 Data Fetching

- **Server Components** for initial page loads — fetch data directly from the SQLite query layer (no API round-trip).
- **Client Components** with `fetch()` to API Route Handlers for mutations (create, update, delete) and interactive filtering.
- `router.refresh()` after mutations to revalidate server components.

### 9.5 Forms & Validation

- **Zod schemas** shared between API route handlers and client-side form validation.
- Use React 19 `useActionState` for form submissions with server-side validation feedback.
- Inline field errors rendered below inputs.

---

## 10. Non-Functional Requirements

- **Performance:** All queries should complete in < 50ms for typical data sizes (hundreds of exercises, dozens of routines). Pages should achieve a Lighthouse performance score ≥ 90.
- **Validation:** Request bodies validated with Zod before hitting the database; return `400` with clear error messages.
- **Error Handling:** Consistent JSON error responses from API: `{ "error": "message" }`. Next.js `error.tsx` boundaries for UI errors.
- **Idempotency:** Scheduling the same routine on the same date twice returns `409 Conflict`.
- **Accessibility:** Semantic HTML, ARIA labels on interactive elements, keyboard navigable, minimum contrast ratios per WCAG 2.1 AA.
- **No Auth (v1):** Single-user, local application — no authentication layer in the initial version.

---

## 11. Future Considerations (Out of Scope for v1)

- User authentication and multi-tenancy.
- **Full offline support** — IndexedDB cache, background sync, conflict resolution.
- **Push notifications** — reminders for scheduled workouts.
- Workout logging / tracking (actual sets, reps, weight performed).
- Recurring schedules (e.g., "every Monday").
- Exercise tagging and full-text search.
- Routine templates / cloning.
- Dark mode (custom property swap).
- Drag-and-drop reordering of exercises within phases.
- REST → Server Actions migration for mutations.

---

## 12. Success Criteria

1. A user can CRUD exercises from the UI and API.
2. A user can compose exercises into a routine with warm-up, workout, and cool-down phases.
3. A user can schedule a routine for a future date via the schedule page.
4. The home page (`/`) shows today's scheduled routines with exercises grouped by phase.
5. All API endpoints return proper status codes and consistent JSON.
6. The app is **installable** as a PWA on mobile and desktop (passes Lighthouse PWA audit).
7. The UI is fully usable at **375px viewport width** and scales up responsively.
8. All pages load in under **2 seconds** on a 4G connection (after install).
