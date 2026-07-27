import Image from "next/image";
import Link from "next/link";
import { listExercises } from "@/lib/db/queries/exercises";
import type { Exercise } from "@/lib/schemas/exercise";
import ExerciseSearch from "./ExerciseSearch";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ missing_video?: string; q?: string }> };

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

function getExerciseVisual(exercise: Exercise): string | null {
  if (exercise.image_url) return exercise.image_url;
  if (!exercise.video_url) return null;

  const ytId = getYouTubeId(exercise.video_url);
  if (!ytId) return null;
  return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
}

export default async function ExercisesPage({ searchParams }: Props) {
  const { missing_video, q } = await searchParams;
  const filterNoVideo = missing_video === "1";
  const query = (q ?? "").trim().toLowerCase();
  let exercises = listExercises();

  if (filterNoVideo) {
    exercises = exercises.filter((ex) => !ex.video_url);
  }

  if (query) {
    exercises = exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(query) ||
        ex.category?.toLowerCase().includes(query) ||
        ex.muscle_group?.toLowerCase().includes(query) ||
        ex.equipment?.toLowerCase().includes(query),
    );
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Exercises</h2>
        <Link href="/exercises/new" className="btn btn--primary">
          + New
        </Link>
      </div>

      <div className="filter-bar">
        <ExerciseSearch />
        <Link
          href={filterNoVideo ? "/exercises" : "/exercises?missing_video=1"}
          className={`btn btn--sm ${filterNoVideo ? "btn--primary" : "btn--secondary"}`}
        >
          {filterNoVideo ? "✕ " : ""}Missing Video
        </Link>
      </div>

      {exercises.length === 0 ? (
        <div className="empty-state">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M6.5 6.5h11M6.5 17.5h11M2 12h3M19 12h3M6.5 6.5v11M17.5 6.5v11" />
          </svg>
          <h2>
            {filterNoVideo ? "All exercises have videos!" : "No exercises yet"}
          </h2>
          <p>
            {filterNoVideo
              ? "Every exercise in your library has a video link."
              : "Start building your exercise library by adding your first movement."}
          </p>
          {!filterNoVideo && (
            <Link href="/exercises/new" className="btn btn--primary">
              Add Exercise
            </Link>
          )}
        </div>
      ) : (
        <div className="card-grid">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card">
                {(() => {
                  const visualUrl = getExerciseVisual(exercise);
                  if (visualUrl) {
                    return (
                      <Image
                        src={visualUrl}
                        alt={`${exercise.name} reference`}
                        width={400}
                        height={140}
                        sizes="(max-width: 640px) 100vw, 400px"
                        unoptimized
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "var(--space-sm)",
                        }}
                      />
                    );
                  }

                  return (
                    <div
                      style={{
                        height: 140,
                        borderRadius: "var(--radius-sm)",
                        marginBottom: "var(--space-sm)",
                        background: "var(--color-accent-light)",
                        color: "var(--color-text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        width={24}
                        height={24}
                        aria-label="No exercise visual"
                      >
                        <path d="M3 7.25A2.25 2.25 0 0 1 5.25 5h13.5A2.25 2.25 0 0 1 21 7.25v9.5A2.25 2.25 0 0 1 18.75 19H5.25A2.25 2.25 0 0 1 3 16.75v-9.5Z" />
                        <path d="m8.25 10.25 1.9 1.9a.75.75 0 0 0 1.06 0l2.27-2.27a.75.75 0 0 1 1.06 0l1.2 1.2" />
                        <circle cx="8.25" cy="8.5" r="1" />
                      </svg>
                    </div>
                  );
                })()}
                <div className="card-header">
                  <h3 className="card-title">
                    {exercise.name}
                    {exercise.video_url && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        width={16}
                        height={16}
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                          marginLeft: "var(--space-xs)",
                          color: "var(--color-text-muted)",
                          flexShrink: 0,
                        }}
                        aria-label="Has video"
                      >
                        <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    )}
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-xs)",
                    flexWrap: "wrap",
                  }}
                >
                  {exercise.category && (
                    <span className="badge badge--primary">
                      {exercise.category}
                    </span>
                  )}
                  {exercise.muscle_group && (
                    <span className="badge">{exercise.muscle_group}</span>
                  )}
                  {exercise.equipment && (
                    <span className="badge">{exercise.equipment}</span>
                  )}
                </div>
                {exercise.description && (
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.8125rem",
                      marginTop: "var(--space-sm)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exercise.description}
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
