"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { appPath } from "@/lib/base-path";
import type { Exercise } from "@/lib/schemas/exercise";
import type { RoutineDetail, RoutineSection } from "@/lib/schemas/routine";
import {
  formatLadderReps,
  formatRirBadge,
  formatSectionMeta,
  formatSetsReps,
} from "@/lib/utils";

const sectionFormats = [
  "straight",
  "rounds",
  "emom",
  "superset",
  "tabata",
  "warm-up",
  "cool-down",
  "ladder",
] as const;

export default function EditRoutineClient({
  routineId,
}: {
  routineId: number;
}) {
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Section creation
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionSubmitting, setSectionSubmitting] = useState(false);

  // Exercise creation — tracks which section we're adding to
  const [addToSectionId, setAddToSectionId] = useState<number | null>(null);
  const [exSubmitting, setExSubmitting] = useState(false);

  const loadRoutine = useCallback(async () => {
    const res = await fetch(appPath(`/api/routines/${routineId}`));
    if (res.ok) setRoutine(await res.json());
  }, [routineId]);

  const loadExercises = useCallback(async () => {
    const res = await fetch(appPath("/api/exercises"));
    if (res.ok) setExercises(await res.json());
  }, []);

  useEffect(() => {
    loadRoutine();
    loadExercises();
  }, [loadRoutine, loadExercises]);

  // ─── Section handlers ──────────────────────────────────

  async function handleAddSection(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSectionSubmitting(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const format = form.get("format") as string;
    const formatConfig: Record<string, unknown> = {};

    if (format === "rounds") {
      const rounds = form.get("config_rounds");
      if (rounds) formatConfig.rounds = Number(rounds);
    } else if (format === "emom") {
      const dur = form.get("config_duration");
      if (dur) formatConfig.duration_minutes = Number(dur);
    } else if (format === "tabata") {
      const work = form.get("config_work");
      const rest = form.get("config_rest");
      const tabataRounds = form.get("config_tabata_rounds");
      if (work) formatConfig.work_seconds = Number(work);
      if (rest) formatConfig.rest_seconds = Number(rest);
      if (tabataRounds) formatConfig.rounds = Number(tabataRounds);
    } else if (format === "ladder") {
      const rungs = form.get("config_rungs");
      if (rungs) formatConfig.rungs = Number(rungs);
    }

    const body = {
      name: form.get("name"),
      format,
      position: Number(form.get("position")),
      rest_seconds: form.get("rest_seconds")
        ? Number(form.get("rest_seconds"))
        : undefined,
      notes: form.get("notes") || undefined,
      format_config:
        Object.keys(formatConfig).length > 0 ? formatConfig : undefined,
    };

    const res = await fetch(appPath(`/api/routines/${routineId}/sections`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add section");
      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setSectionSubmitting(false);
      return;
    }

    setRoutine(await res.json());
    setShowAddSection(false);
    setSectionSubmitting(false);
    setFieldErrors({});
  }

  async function handleDeleteSection(sectionId: number) {
    if (!confirm("Delete this section and all its exercises?")) return;
    const res = await fetch(
      appPath(`/api/routines/${routineId}/sections/${sectionId}`),
      {
        method: "DELETE",
      },
    );
    if (res.ok) setRoutine(await res.json());
  }

  async function handleMoveSection(
    sectionId: number,
    direction: "up" | "down",
  ) {
    if (!routine) return;
    const sorted = [...routine.sections].sort(
      (a, b) => a.position - b.position,
    );
    const idx = sorted.findIndex((s) => s.id === sectionId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const res = await fetch(appPath(`/api/routines/${routineId}/sections`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionIdA: sectionId,
        sectionIdB: sorted[swapIdx].id,
      }),
    });
    if (res.ok) setRoutine(await res.json());
  }

  // ─── Exercise handlers ─────────────────────────────────

  async function handleAddExercise(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setExSubmitting(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(e.currentTarget);

    // Compute reps_ladder for ladder sections
    const targetSection = routine?.sections.find(
      (s) => s.id === addToSectionId,
    );
    let repsLadder: number[] | undefined;
    if (targetSection?.format === "ladder") {
      const start = Number(form.get("ladder_start"));
      const end = Number(form.get("ladder_end"));
      const step = Number(form.get("ladder_step"));
      if (start && end && step) {
        repsLadder = [];
        if (start <= end) {
          for (let i = start; i <= end; i += step) repsLadder.push(i);
        } else {
          for (let i = start; i >= end; i -= step) repsLadder.push(i);
        }
      }
    }

    const body = {
      section_id: addToSectionId,
      exercise_id: Number(form.get("exercise_id")),
      position: Number(form.get("position")),
      superset_group: form.get("superset_group") || undefined,
      per_side: form.get("per_side") === "on",
      priority: form.get("priority") === "on",
      sets: form.get("sets") ? Number(form.get("sets")) : undefined,
      reps: form.get("reps") ? Number(form.get("reps")) : undefined,
      duration_seconds: form.get("duration_seconds")
        ? Number(form.get("duration_seconds"))
        : undefined,
      rest_seconds: form.get("rest_seconds")
        ? Number(form.get("rest_seconds"))
        : undefined,
      notes: form.get("notes") || undefined,
      reps_ladder: repsLadder,
    };

    const res = await fetch(appPath(`/api/routines/${routineId}/exercises`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add exercise");
      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setExSubmitting(false);
      return;
    }

    setRoutine(await res.json());
    setAddToSectionId(null);
    setExSubmitting(false);
    setFieldErrors({});
  }

  async function handleRemoveExercise(exerciseEntryId: number) {
    const res = await fetch(
      appPath(`/api/routines/${routineId}/exercises/${exerciseEntryId}`),
      {
        method: "DELETE",
      },
    );
    if (res.ok) loadRoutine();
  }

  async function handleDeleteRoutine() {
    if (!confirm("Delete this entire routine?")) return;
    const res = await fetch(appPath(`/api/routines/${routineId}`), {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/routines");
      router.refresh();
    }
  }

  if (!routine) return <p>Loading...</p>;

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Edit: {routine.name}</h2>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button
            className="btn btn--secondary"
            onClick={() => {
              router.push(`/routines/${routineId}`);
              router.refresh();
            }}
          >
            ← Back
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setShowAddSection(true)}
          >
            + Section
          </button>
          <button className="btn btn--danger" onClick={handleDeleteRoutine}>
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="form-error" style={{ marginBottom: "var(--space-md)" }}>
          {Object.keys(fieldErrors).length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "var(--space-md)" }}>
              {Object.entries(fieldErrors).map(([field, msg]) => (
                <li key={field}>
                  <strong>{field}</strong>: {msg}
                </li>
              ))}
            </ul>
          ) : (
            error
          )}
        </div>
      )}

      {/* ── Add Section Form ─────────────────────────────── */}
      {showAddSection && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <h3
            className="card-title"
            style={{ marginBottom: "var(--space-md)" }}
          >
            Add Section
          </h3>
          <form onSubmit={handleAddSection} className="form-stack">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sec-name" className="form-label">
                  Name *
                </label>
                <input
                  id="sec-name"
                  name="name"
                  required
                  className="form-input"
                  placeholder="e.g. Primer, Part A"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sec-format" className="form-label">
                  Format *
                </label>
                <select
                  id="sec-format"
                  name="format"
                  required
                  className="form-select"
                >
                  {sectionFormats.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sec-position" className="form-label">
                  Position *
                </label>
                <input
                  id="sec-position"
                  name="position"
                  type="number"
                  min="1"
                  required
                  className="form-input"
                  defaultValue={routine.sections.length + 1}
                />
              </div>
              <div className="form-group">
                <label htmlFor="sec-rest" className="form-label">
                  Rest (sec)
                </label>
                <input
                  id="sec-rest"
                  name="rest_seconds"
                  type="number"
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="config_rounds" className="form-label">
                  Rounds (if rounds format)
                </label>
                <input
                  id="config_rounds"
                  name="config_rounds"
                  type="number"
                  min="1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="config_duration" className="form-label">
                  Duration min (if EMOM)
                </label>
                <input
                  id="config_duration"
                  name="config_duration"
                  type="number"
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="config_work" className="form-label">
                  Work sec (if Tabata)
                </label>
                <input
                  id="config_work"
                  name="config_work"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="20"
                />
              </div>
              <div className="form-group">
                <label htmlFor="config_rest" className="form-label">
                  Rest sec (if Tabata)
                </label>
                <input
                  id="config_rest"
                  name="config_rest"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="10"
                />
              </div>
              <div className="form-group">
                <label htmlFor="config_tabata_rounds" className="form-label">
                  Rounds (if Tabata)
                </label>
                <input
                  id="config_tabata_rounds"
                  name="config_tabata_rounds"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="6"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="config_rungs" className="form-label">
                  Rungs (if Ladder)
                </label>
                <input
                  id="config_rungs"
                  name="config_rungs"
                  type="number"
                  min="2"
                  className="form-input"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sec-notes" className="form-label">
                Notes
              </label>
              <input
                id="sec-notes"
                name="notes"
                className="form-input"
                placeholder="Section instructions"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={sectionSubmitting}
                className="btn btn--primary"
              >
                {sectionSubmitting ? "Adding..." : "Add Section"}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowAddSection(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Add Exercise Form ────────────────────────────── */}
      {addToSectionId !== null && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <h3
            className="card-title"
            style={{ marginBottom: "var(--space-md)" }}
          >
            Add Exercise to{" "}
            {routine.sections.find((s) => s.id === addToSectionId)?.name}
          </h3>
          <form onSubmit={handleAddExercise} className="form-stack">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="exercise_id" className="form-label">
                  Exercise *
                </label>
                <select
                  id="exercise_id"
                  name="exercise_id"
                  required
                  className="form-select"
                >
                  <option value="">Select...</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ex-position" className="form-label">
                  Position *
                </label>
                <input
                  id="ex-position"
                  name="position"
                  type="number"
                  min="1"
                  required
                  className="form-input"
                  defaultValue={
                    (routine.sections.find((s) => s.id === addToSectionId)
                      ?.exercises.length ?? 0) + 1
                  }
                />
              </div>
            </div>

            {routine.sections.find((s) => s.id === addToSectionId)?.format ===
            "ladder" ? (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ladder_start" className="form-label">
                    Start reps
                  </label>
                  <input
                    id="ladder_start"
                    name="ladder_start"
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    placeholder="10"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ladder_end" className="form-label">
                    End reps
                  </label>
                  <input
                    id="ladder_end"
                    name="ladder_end"
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ladder_step" className="form-label">
                    Step
                  </label>
                  <input
                    id="ladder_step"
                    name="ladder_step"
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    placeholder="10"
                  />
                </div>
              </div>
            ) : (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ex-sets" className="form-label">
                    Sets
                  </label>
                  <input
                    id="ex-sets"
                    name="sets"
                    type="number"
                    min="1"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ex-reps" className="form-label">
                    Reps
                  </label>
                  <input
                    id="ex-reps"
                    name="reps"
                    type="number"
                    min="1"
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ex-duration" className="form-label">
                  Duration (sec)
                </label>
                <input
                  id="ex-duration"
                  name="duration_seconds"
                  type="number"
                  min="1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ex-rest" className="form-label">
                  Rest (sec)
                </label>
                <input
                  id="ex-rest"
                  name="rest_seconds"
                  type="number"
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ex-group" className="form-label">
                  Superset Group
                </label>
                <input
                  id="ex-group"
                  name="superset_group"
                  className="form-input"
                  placeholder="e.g. A, B, ODD, EVEN"
                />
              </div>
              <div
                className="form-group"
                style={{ justifyContent: "flex-end" }}
              >
                <label
                  className="form-label"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                  }}
                >
                  <input type="checkbox" name="per_side" />
                  Per side
                </label>
              </div>
              <div
                className="form-group"
                style={{ justifyContent: "flex-end" }}
              >
                <label
                  className="form-label"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                  }}
                >
                  <input type="checkbox" name="priority" />
                  Priority exercise
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ex-notes" className="form-label">
                Notes
              </label>
              <input
                id="ex-notes"
                name="notes"
                className="form-input"
                placeholder="e.g. Light pace, Each leg"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={exSubmitting}
                className="btn btn--primary"
              >
                {exSubmitting ? "Adding..." : "Add Exercise"}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setAddToSectionId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Sections ─────────────────────────────────────── */}
      {routine.sections.length === 0 ? (
        <div className="empty-state">
          <h2>No sections yet</h2>
          <p>
            Add a section (e.g. Primer, Part A, Part B) to start building this
            routine.
          </p>
        </div>
      ) : (
        routine.sections.map((section, index) => {
          const meta = formatSectionMeta(section.format, section.format_config);
          const sorted = [...routine.sections].sort(
            (a, b) => a.position - b.position,
          );
          const sortedIdx = sorted.findIndex((s) => s.id === section.id);
          const isFirst = sortedIdx === 0;
          const isLast = sortedIdx === sorted.length - 1;
          return (
            <div key={section.id} className="section-block">
              <div className="section-header">
                <span className="section-title">{section.name}</span>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-xs)",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {meta && <span className="badge badge--primary">{meta}</span>}
                  <span className="badge">{section.exercises.length}</span>
                  <button
                    className="btn btn--ghost btn--icon"
                    onClick={() => handleMoveSection(section.id, "up")}
                    disabled={isFirst}
                    aria-label="Move section up"
                  >
                    ↑
                  </button>
                  <button
                    className="btn btn--ghost btn--icon"
                    onClick={() => handleMoveSection(section.id, "down")}
                    disabled={isLast}
                    aria-label="Move section down"
                  >
                    ↓
                  </button>
                  <button
                    className="btn btn--ghost btn--icon"
                    onClick={() => setAddToSectionId(section.id)}
                  >
                    + Add
                  </button>
                  <button
                    className="btn btn--ghost btn--icon"
                    onClick={() => handleDeleteSection(section.id)}
                    style={{ color: "var(--color-danger)" }}
                  >
                    ✕
                  </button>
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

              {section.exercises.length === 0 ? (
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.875rem",
                    padding: "var(--space-sm) 0",
                  }}
                >
                  No exercises in this section yet.
                </p>
              ) : (
                section.exercises.map((ex) => (
                  <div key={ex.id} className="exercise-item">
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
                        {ex.exercise.name}
                        {ex.per_side && (
                          <span
                            className="badge badge--warning"
                            style={{ marginLeft: 6, fontSize: "0.6875rem" }}
                          >
                            per side
                          </span>
                        )}
                      </div>
                      <div className="exercise-meta">
                        <span>
                          {ex.reps_ladder
                            ? formatLadderReps(ex.reps_ladder)
                            : formatSetsReps(
                                ex.sets,
                                ex.reps,
                                ex.duration_seconds,
                              )}
                        </span>
                        {ex.rest_seconds && (
                          <span>Rest: {ex.rest_seconds}s</span>
                        )}
                        {formatRirBadge(ex.rir) && (
                          <span className="rir-badge">
                            {formatRirBadge(ex.rir)}
                          </span>
                        )}
                      </div>
                      {ex.notes && (
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--color-text-muted)",
                            fontStyle: "italic",
                          }}
                        >
                          {ex.notes}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn btn--ghost"
                      onClick={() => handleRemoveExercise(ex.id)}
                      aria-label={`Remove ${ex.exercise.name}`}
                      style={{ color: "var(--color-danger)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })
      )}
    </>
  );
}
