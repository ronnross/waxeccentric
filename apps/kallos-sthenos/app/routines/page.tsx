import Link from "next/link";
import { listRoutines } from "@/lib/db/queries/routines";

export const dynamic = "force-dynamic";

export default function RoutinesPage() {
  const routines = listRoutines();

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Routines</h2>
        <Link href="/routines/new" className="btn btn--primary">
          + New
        </Link>
      </div>

      {routines.length === 0 ? (
        <div className="empty-state">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <h2>No routines yet</h2>
          <p>Create your first routine to start organizing your workouts.</p>
          <Link href="/routines/new" className="btn btn--primary">
            Create Routine
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/routines/${routine.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">{routine.name}</h3>
                </div>
                {routine.description && (
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {routine.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
