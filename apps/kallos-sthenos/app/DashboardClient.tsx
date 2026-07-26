"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import EmomTimer from "@/components/EmomTimer";
import RatingModal from "@/components/RatingModal";
import TabataTimer from "@/components/TabataTimer";
import VideoModal from "@/components/VideoModal";
import WeeklyVolumeTracker from "@/components/WeeklyVolumeTracker";
import WorkoutLogger from "@/components/WorkoutLogger";
import { appPath } from "@/lib/base-path";
import { formatRirBadge, getRirBucketLabel } from "@/lib/utils";

interface Exercise {
  id: number;
  exercise: { id: number; name: string; video_url: string | null };
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number | null;
  per_side: boolean;
  notes: string | null;
  position: number;
  superset_group: string | null;
  rir: number | null;
  priority: boolean;
  reps_ladder: number[] | null;
}

interface Section {
  id: number;
  name: string;
  format: string;
  format_config: Record<string, unknown> | null;
  notes: string | null;
  exercises: Exercise[];
}

interface Routine {
  id: number;
  name: string;
  description: string | null;
  sections: Section[];
}

interface ScheduleEntry {
  schedule_id: number;
  date: string;
  completed: boolean;
  notes: string | null;
  rating: number | null;
  routine: Routine | null | undefined;
}

function toLocalISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekDays(): {
  date: Date;
  iso: string;
  dayName: string;
  dayNum: number;
  isToday: boolean;
}[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayISO = toLocalISO(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday
  // Start from Monday: offset is (dayOfWeek + 6) % 7
  const mondayOffset = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = toLocalISO(d);
    days.push({
      date: d,
      iso,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      isToday: iso === todayISO,
    });
  }
  return days;
}

function formatSetsReps(
  sets: number | null,
  reps: number | null,
  durationSeconds: number | null,
): string {
  const parts: string[] = [];
  if (sets) parts.push(`${sets} sets`);
  if (reps) parts.push(`${reps} reps`);
  if (durationSeconds) parts.push(`${durationSeconds}s`);
  return parts.join(" × ") || "—";
}

function formatSectionMeta(
  format: string,
  config: Record<string, unknown> | null,
): string {
  switch (format) {
    case "emom":
      return config?.duration_minutes
        ? `EMOM ${config.duration_minutes} min`
        : "EMOM";
    case "rounds": {
      const rounds = config?.rounds as number | undefined;
      return rounds ? `${rounds} round${rounds > 1 ? "s" : ""}` : "Rounds";
    }
    case "superset":
      return "Superset";
    case "tabata": {
      const work = config?.work_seconds as number | undefined;
      const rest = config?.rest_seconds as number | undefined;
      const tabataRounds = config?.rounds as number | undefined;
      const parts: string[] = ["Tabata"];
      if (work && rest) parts.push(`${work}s/${rest}s`);
      if (tabataRounds) parts.push(`×${tabataRounds}`);
      return parts.join(" ");
    }
    case "ladder": {
      const rungs = config?.rungs as number | undefined;
      return rungs ? `Ladder × ${rungs} rungs` : "Ladder";
    }
    default:
      return "";
  }
}

const RIR_BUCKETS = [
  { label: "Easy", value: 4, hint: "Stop with plenty left in the tank" },
  { label: "About right", value: 2, hint: "Challenging, but controlled" },
  { label: "Hard", value: 1, hint: "Very close to failure" },
] as const;

export default function DashboardClient({
  initialSchedule,
  initialDate,
}: {
  initialSchedule: ScheduleEntry[];
  initialDate: string;
}) {
  const router = useRouter();
  const weekDays = getWeekDays();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(initialSchedule);
  const [loading, setLoading] = useState(false);
  const [videoModal, setVideoModal] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [editingRirExerciseId, setEditingRirExerciseId] = useState<
    number | null
  >(null);
  const [ratingModal, setRatingModal] = useState<{
    scheduleId: number;
    routineName: string;
  } | null>(null);

  const fetchSchedule = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const res = await fetch(appPath(`/api/schedule?date=${date}`));
      if (res.ok) {
        const data = await res.json();
        setSchedule(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDayClick = useCallback(
    (iso: string) => {
      setSelectedDate(iso);
      router.push(`/?date=${iso}`);
      if (iso !== initialDate) {
        fetchSchedule(iso);
      } else {
        setSchedule(initialSchedule);
      }
    },
    [initialDate, initialSchedule, fetchSchedule, router],
  );

  const markComplete = useCallback(
    async (scheduleId: number, rating: number | null) => {
      // Optimistic update
      setSchedule((prev) =>
        prev.map((e) =>
          e.schedule_id === scheduleId ? { ...e, completed: true, rating } : e,
        ),
      );
      try {
        const body: Record<string, unknown> = { completed: true };
        if (rating !== null) body.rating = rating;
        const res = await fetch(appPath(`/api/schedule/${scheduleId}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          setSchedule((prev) =>
            prev.map((e) =>
              e.schedule_id === scheduleId
                ? { ...e, completed: false, rating: null }
                : e,
            ),
          );
        }
      } catch {
        setSchedule((prev) =>
          prev.map((e) =>
            e.schedule_id === scheduleId
              ? { ...e, completed: false, rating: null }
              : e,
          ),
        );
      }
    },
    [],
  );

  const toggleComplete = useCallback(
    async (
      scheduleId: number,
      currentlyCompleted: boolean,
      routineName: string,
    ) => {
      if (!currentlyCompleted) {
        // Show rating modal before marking complete
        setRatingModal({ scheduleId, routineName });
        return;
      }
      // Un-completing: just toggle directly
      setSchedule((prev) =>
        prev.map((e) =>
          e.schedule_id === scheduleId
            ? { ...e, completed: false, rating: null }
            : e,
        ),
      );
      try {
        const res = await fetch(appPath(`/api/schedule/${scheduleId}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: false, rating: null }),
        });
        if (!res.ok) {
          setSchedule((prev) =>
            prev.map((e) =>
              e.schedule_id === scheduleId ? { ...e, completed: true } : e,
            ),
          );
        }
      } catch {
        setSchedule((prev) =>
          prev.map((e) =>
            e.schedule_id === scheduleId ? { ...e, completed: true } : e,
          ),
        );
      }
    },
    [],
  );

  const handleRirChange = useCallback(
    async (routineId: number, exerciseEntryId: number, rir: number | null) => {
      try {
        await fetch(
          appPath(`/api/routines/${routineId}/exercises/${exerciseEntryId}`),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rir }),
          },
        );
        // Update local state
        setSchedule((prev) =>
          prev.map((entry) => {
            if (!entry.routine) return entry;
            return {
              ...entry,
              routine: {
                ...entry.routine,
                sections: entry.routine.sections.map((s) => ({
                  ...s,
                  exercises: s.exercises.map((ex) =>
                    ex.id === exerciseEntryId ? { ...ex, rir } : ex,
                  ),
                })),
              },
            };
          }),
        );
        setEditingRirExerciseId(null);
      } catch {
        // silently fail
      }
    },
    [],
  );

  // Find the selected day info for display
  const selectedDay = weekDays.find((d) => d.iso === selectedDate);
  const selectedLabel = selectedDay
    ? selectedDay.date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : selectedDate;

  const mondayISO = weekDays[0].iso;
  const sundayISO = weekDays[6].iso;

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>

      {/* Week tile strip */}
      <div className="week-strip">
        {weekDays.map((day) => {
          const isSelected = day.iso === selectedDate;

          return (
            <button
              key={day.iso}
              className={`week-tile${isSelected ? " week-tile--selected" : ""}${day.isToday ? " week-tile--today" : ""}`}
              onClick={() => handleDayClick(day.iso)}
              aria-label={`${day.dayName} ${day.dayNum}${day.isToday ? " (today)" : ""}`}
              aria-pressed={isSelected}
            >
              <span className="week-tile__day">{day.dayName}</span>
              <span className="week-tile__num">{day.dayNum}</span>
              {day.isToday && <span className="week-tile__dot" />}
            </button>
          );
        })}
      </div>

      {/* Weekly insights */}
      <div className="dashboard-widgets">
        <WeeklyVolumeTracker mondayISO={mondayISO} sundayISO={sundayISO} />
      </div>

      {/* Selected day label */}
      <div className="day-label">
        <span>{selectedLabel}</span>
      </div>

      {/* Schedule content */}
      {loading ? (
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      ) : schedule.length === 0 ? (
        <div className="empty-state">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h2>No workouts scheduled</h2>
          <p>
            {selectedDate === initialDate
              ? "Schedule a routine from the Schedule tab or enjoy your rest day!"
              : "Nothing scheduled for this day."}
          </p>
          <Link href="/schedule" className="btn btn--primary">
            Go to Schedule
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {schedule.map((entry) => {
            const routine = entry.routine;
            if (!routine) return null;

            return (
              <div
                key={entry.schedule_id}
                className={`card${entry.completed ? " card--completed" : ""}`}
              >
                <div className="card-header">
                  <h3 className="card-title">{routine.name}</h3>
                  <button
                    className={`btn btn--sm ${entry.completed ? "btn--success" : "btn--primary"}`}
                    onClick={() =>
                      toggleComplete(
                        entry.schedule_id,
                        entry.completed,
                        routine.name,
                      )
                    }
                  >
                    {entry.completed ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Completed
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        Mark Complete
                      </>
                    )}
                  </button>
                </div>
                {routine.description && (
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.875rem",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    {routine.description}
                  </p>
                )}

                {routine.sections.map((section) => {
                  const meta = formatSectionMeta(
                    section.format,
                    section.format_config,
                  );

                  const groups: {
                    group: string | null;
                    exercises: Exercise[];
                  }[] = [];
                  for (const ex of section.exercises) {
                    const lastGroup = groups[groups.length - 1];
                    if (lastGroup && lastGroup.group === ex.superset_group) {
                      lastGroup.exercises.push(ex);
                    } else {
                      groups.push({
                        group: ex.superset_group,
                        exercises: [ex],
                      });
                    }
                  }

                  // Priority nudge: check if any priority exercise is not first
                  const priorityExNotFirst = section.exercises.find(
                    (ex) => ex.priority && ex.position !== 1,
                  );

                  return (
                    <div key={section.id} className="section-block">
                      <div className="section-header">
                        <span className="section-title">{section.name}</span>
                        {meta && (
                          <span className="badge badge--primary">{meta}</span>
                        )}
                      </div>

                      {section.notes && (
                        <p
                          className="text-note"
                          style={{ marginBottom: "var(--space-sm)" }}
                        >
                          {section.notes}
                        </p>
                      )}

                      {priorityExNotFirst && (
                        <div className="priority-nudge">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Place {priorityExNotFirst.exercise.name} first for
                          best strength gains
                        </div>
                      )}

                      {section.exercises.map((ex) => (
                        <div key={ex.id}>
                          <div className="exercise-item">
                            <span className="exercise-position">
                              {ex.superset_group
                                ? `${ex.superset_group}${ex.position}`
                                : ex.position}
                            </span>
                            <div className="exercise-info">
                              <div className="exercise-name">
                                {ex.priority && (
                                  <svg
                                    className="priority-badge"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                )}
                                {ex.exercise.video_url ? (
                                  <span
                                    className="exercise-video-link"
                                    onClick={() =>
                                      setVideoModal({
                                        url: ex.exercise.video_url!,
                                        name: ex.exercise.name,
                                      })
                                    }
                                  >
                                    {ex.exercise.name}
                                    <svg
                                      className="exercise-video-icon"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </span>
                                ) : (
                                  ex.exercise.name
                                )}
                                {ex.per_side && (
                                  <span
                                    className="badge badge--warning"
                                    style={{
                                      marginLeft: 6,
                                      fontSize: "0.6875rem",
                                    }}
                                  >
                                    per side
                                  </span>
                                )}
                              </div>
                              <div className="exercise-meta">
                                <span>
                                  {ex.reps_ladder
                                    ? ex.reps_ladder.join(" → ")
                                    : formatSetsReps(
                                        ex.sets,
                                        ex.reps,
                                        ex.duration_seconds,
                                      )}
                                </span>
                                {ex.rest_seconds && (
                                  <span>Rest: {ex.rest_seconds}s</span>
                                )}
                                <button
                                  type="button"
                                  className={`rir-badge${ex.rir === null ? " rir-badge--empty" : " rir-badge--button"}`}
                                  title={
                                    ex.rir === null
                                      ? "Set target effort"
                                      : `Target effort: ${getRirBucketLabel(ex.rir)}`
                                  }
                                  onClick={() =>
                                    setEditingRirExerciseId((current) =>
                                      current === ex.id ? null : ex.id,
                                    )
                                  }
                                  aria-expanded={editingRirExerciseId === ex.id}
                                >
                                  {ex.rir === null
                                    ? "Set target effort"
                                    : formatRirBadge(ex.rir)}
                                </button>
                              </div>
                              {ex.notes && (
                                <p className="text-note">{ex.notes}</p>
                              )}

                              {editingRirExerciseId === ex.id && (
                                <div className="rir-editor">
                                  <span className="rir-editor__label">
                                    Target effort
                                  </span>
                                  <div className="rir-selector">
                                    {RIR_BUCKETS.map((bucket) => {
                                      const isSelected =
                                        getRirBucketLabel(ex.rir) ===
                                        bucket.label;

                                      return (
                                        <button
                                          key={bucket.label}
                                          type="button"
                                          className={`rir-btn rir-btn--wide${isSelected ? " rir-btn--selected" : ""}`}
                                          title={bucket.hint}
                                          onClick={() =>
                                            handleRirChange(
                                              routine.id,
                                              ex.id,
                                              isSelected ? null : bucket.value,
                                            )
                                          }
                                        >
                                          {bucket.label}
                                        </button>
                                      );
                                    })}
                                    <button
                                      type="button"
                                      className="rir-clear-btn"
                                      onClick={() => {
                                        if (ex.rir === null) {
                                          setEditingRirExerciseId(null);
                                          return;
                                        }
                                        handleRirChange(
                                          routine.id,
                                          ex.id,
                                          null,
                                        );
                                      }}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Workout logger */}
                          <WorkoutLogger
                            scheduleId={entry.schedule_id}
                            routineExerciseId={ex.id}
                            prescribedSets={
                              ex.reps_ladder ? ex.reps_ladder.length : ex.sets
                            }
                          />
                        </div>
                      ))}

                      {section.format === "emom" &&
                        typeof section.format_config?.duration_minutes ===
                          "number" && (
                          <EmomTimer
                            durationMinutes={
                              section.format_config.duration_minutes as number
                            }
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
                })}
              </div>
            );
          })}
        </div>
      )}

      {videoModal && (
        <VideoModal
          videoUrl={videoModal.url}
          exerciseName={videoModal.name}
          onClose={() => setVideoModal(null)}
        />
      )}

      {ratingModal && (
        <RatingModal
          routineName={ratingModal.routineName}
          onSubmit={(rating) => {
            markComplete(ratingModal.scheduleId, rating);
            setRatingModal(null);
          }}
          onClose={() => {
            // Skip rating, still mark complete
            markComplete(ratingModal.scheduleId, null);
            setRatingModal(null);
          }}
        />
      )}
    </>
  );
}
