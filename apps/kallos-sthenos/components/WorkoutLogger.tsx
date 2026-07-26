"use client";

import { useCallback, useEffect, useState } from "react";
import { appPath } from "@/lib/base-path";

interface LogEntry {
  id: number;
  routine_exercise_id: number;
  set_number: number;
  weight: number | null;
  reps: number | null;
  rir: number | null;
}

export default function WorkoutLogger({
  scheduleId,
  routineExerciseId,
  prescribedSets,
}: {
  scheduleId: number;
  routineExerciseId: number;
  prescribedSets: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const setCount = prescribedSets ?? 3;

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(
        appPath(`/api/workout-logs?schedule_id=${scheduleId}`),
      );
      if (res.ok) {
        const all: LogEntry[] = await res.json();
        setLogs(all.filter((l) => l.routine_exercise_id === routineExerciseId));
      }
    } catch {
      // silently fail
    } finally {
      setLoaded(true);
    }
  }, [scheduleId, routineExerciseId]);

  useEffect(() => {
    if (expanded && !loaded) {
      fetchLogs();
    }
  }, [expanded, loaded, fetchLogs]);

  const handleSave = useCallback(
    async (setNumber: number, field: "weight" | "reps", value: string) => {
      const numVal = value === "" ? null : Number(value);
      const existing = logs.find((l) => l.set_number === setNumber);

      if (existing) {
        const res = await fetch(appPath(`/api/workout-logs/${existing.id}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: numVal }),
        });
        if (res.ok) {
          setLogs((prev) =>
            prev.map((l) =>
              l.id === existing.id ? { ...l, [field]: numVal } : l,
            ),
          );
        }
      } else {
        const body = {
          schedule_id: scheduleId,
          routine_exercise_id: routineExerciseId,
          set_number: setNumber,
          [field]: numVal,
        };
        const res = await fetch(appPath("/api/workout-logs"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const newLog: LogEntry = await res.json();
          setLogs((prev) => [...prev, newLog]);
        }
      }
    },
    [logs, scheduleId, routineExerciseId],
  );

  const hasLogs = logs.length > 0;

  return (
    <div className="workout-logger">
      <button
        type="button"
        className="workout-logger__toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          {expanded ? (
            <polyline points="6 9 12 15 18 9" />
          ) : (
            <polyline points="9 18 15 12 9 6" />
          )}
        </svg>
        Log sets{hasLogs ? ` (${logs.length})` : ""}
      </button>

      {expanded && (
        <div className="log-grid" style={{ marginTop: "var(--space-xs)" }}>
          <span className="log-grid__label">Set</span>
          <span className="log-grid__label">Weight</span>
          <span className="log-grid__label">Reps</span>
          <span />

          {Array.from({ length: setCount }, (_, i) => {
            const setNum = i + 1;
            const existing = logs.find((l) => l.set_number === setNum);

            return (
              <LogSetRow
                key={setNum}
                setNumber={setNum}
                weight={existing?.weight ?? null}
                reps={existing?.reps ?? null}
                onSave={handleSave}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function LogSetRow({
  setNumber,
  weight,
  reps,
  onSave,
}: {
  setNumber: number;
  weight: number | null;
  reps: number | null;
  onSave: (setNumber: number, field: "weight" | "reps", value: string) => void;
}) {
  const [saved, setSaved] = useState(false);

  const handleBlur = (field: "weight" | "reps", value: string) => {
    onSave(setNumber, field, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <>
      <span className="log-grid__label">{setNumber}</span>
      <input
        type="number"
        className="log-input"
        placeholder="kgs"
        defaultValue={weight ?? ""}
        onBlur={(e) => handleBlur("weight", e.target.value)}
        min={0}
        step="any"
      />
      <input
        type="number"
        className="log-input"
        placeholder="reps"
        defaultValue={reps ?? ""}
        onBlur={(e) => handleBlur("reps", e.target.value)}
        min={0}
      />
      {saved ? (
        <span className="log-saved">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      ) : (
        <span />
      )}
    </>
  );
}
