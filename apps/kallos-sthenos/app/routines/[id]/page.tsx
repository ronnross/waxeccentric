import Link from "next/link";
import { notFound } from "next/navigation";
import EmomTimer from "@/components/EmomTimer";
import ExerciseRowWithVideo from "@/components/ExerciseRowWithVideo";
import TabataTimer from "@/components/TabataTimer";
import { getRoutineDetail } from "@/lib/db/queries/routines";
import type { SectionExercise } from "@/lib/schemas/routine";
import { formatSectionMeta } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function RoutineDetailPage({ params }: Props) {
  const { id } = await params;
  const routine = getRoutineDetail(Number(id));

  if (!routine) notFound();

  const totalExercises = routine.sections.reduce(
    (sum, s) => sum + s.exercises.length,
    0,
  );

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">{routine.name}</h2>
        <Link
          href={`/routines/${routine.id}/edit`}
          className="btn btn--secondary"
        >
          Edit
        </Link>
      </div>

      {routine.description && (
        <p
          style={{
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-lg)",
          }}
        >
          {routine.description}
        </p>
      )}

      {totalExercises === 0 && routine.sections.length === 0 ? (
        <div className="empty-state">
          <h2>No sections yet</h2>
          <p>
            Add sections and exercises to this routine to build out your
            workout.
          </p>
          <Link
            href={`/routines/${routine.id}/edit`}
            className="btn btn--primary"
          >
            Edit Routine
          </Link>
        </div>
      ) : (
        routine.sections.map((section) => {
          const meta = formatSectionMeta(section.format, section.format_config);

          // Group exercises by superset_group for visual grouping
          const groups: {
            group: string | null;
            exercises: SectionExercise[];
          }[] = [];
          for (const ex of section.exercises) {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.group === ex.superset_group) {
              lastGroup.exercises.push(ex);
            } else {
              groups.push({ group: ex.superset_group, exercises: [ex] });
            }
          }

          return (
            <div key={section.id} className="section-block">
              <div className="section-header">
                <span className="section-title">{section.name}</span>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-xs)",
                    alignItems: "center",
                  }}
                >
                  {meta && <span className="badge badge--primary">{meta}</span>}
                  <span className="badge">{section.exercises.length}</span>
                </div>
              </div>

              {section.notes && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                    fontStyle: "italic",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  {section.notes}
                </p>
              )}

              {section.rest_seconds && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  Rest {section.rest_seconds}s between sets
                </p>
              )}

              {(() => {
                const priorityExNotFirst = section.exercises.find(
                  (ex) => ex.priority && ex.position !== 1,
                );
                return priorityExNotFirst ? (
                  <div className="priority-nudge">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Place {priorityExNotFirst.exercise.name} first for best
                    strength gains
                  </div>
                ) : null;
              })()}

              {groups.map((g, gi) => (
                <div
                  key={gi}
                  className={g.group ? "superset-group" : undefined}
                >
                  {g.group && section.format === "emom" && (
                    <div className="superset-label">{g.group} Minutes</div>
                  )}
                  {g.group && section.format !== "emom" && (
                    <div className="superset-label">Superset {g.group}</div>
                  )}
                  {g.exercises.map((ex) => (
                    <ExerciseRowWithVideo key={ex.id} ex={ex} />
                  ))}
                </div>
              ))}

              {section.format === "emom" &&
                typeof section.format_config?.duration_minutes === "number" && (
                  <EmomTimer
                    durationMinutes={section.format_config.duration_minutes}
                    groups={groups}
                  />
                )}

              {section.format === "tabata" && section.format_config && (
                <TabataTimer
                  workSeconds={
                    (section.format_config.work_seconds as number) ?? 20
                  }
                  restSeconds={
                    (section.format_config.rest_seconds as number) ?? 10
                  }
                  rounds={(section.format_config.rounds as number) ?? 8}
                  exercises={section.exercises}
                />
              )}
            </div>
          );
        })
      )}
    </>
  );
}
