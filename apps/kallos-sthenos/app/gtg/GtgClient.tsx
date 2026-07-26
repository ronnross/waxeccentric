"use client";

import { useCallback, useState } from "react";
import { appPath } from "@/lib/base-path";

interface Exercise {
  id: number;
  name: string;
}

interface GtgProgram {
  id: number;
  exercise_id: number;
  exercise_name: string;
  daily_goal: number;
  reps_per_set: number;
  start_date: string;
  end_date: string;
  active: boolean;
  sets_today: number;
  reps_today: number;
}

interface GtgClientProps {
  initialProgram: GtgProgram | null;
  exercises: Exercise[];
  today: string;
}

export default function GtgClient({
  initialProgram,
  exercises,
  today,
}: GtgClientProps) {
  const [program, setProgram] = useState<GtgProgram | null>(initialProgram);
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // Setup form state
  const [exerciseId, setExerciseId] = useState("");
  const [dailyGoal, setDailyGoal] = useState("50");
  const [repsPerSet, setRepsPerSet] = useState("5");
  const [formError, setFormError] = useState("");

  const logSet = useCallback(async () => {
    if (!program || loading) return;
    setLoading(true);
    try {
      const res = await fetch(appPath(`/api/gtg/${program.id}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgram((prev) =>
          prev
            ? {
                ...prev,
                sets_today: data.sets_today,
                reps_today: data.reps_today,
              }
            : prev,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [program, loading, today]);

  const undoSet = useCallback(async () => {
    if (!program || loading || program.sets_today === 0) return;
    setLoading(true);
    try {
      const res = await fetch(appPath(`/api/gtg/${program.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "undo", date: today }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgram((prev) =>
          prev
            ? {
                ...prev,
                sets_today: data.sets_today,
                reps_today: data.reps_today,
              }
            : prev,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [program, loading, today]);

  const endProgram = useCallback(async () => {
    if (!program) return;
    const res = await fetch(appPath(`/api/gtg/${program.id}`), {
      method: "DELETE",
    });
    if (res.ok) {
      setProgram(null);
    }
  }, [program]);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!exerciseId) {
      setFormError("Please select an exercise");
      return;
    }

    // Default to a week from today
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);
    const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    const res = await fetch(appPath("/api/gtg"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exercise_id: Number(exerciseId),
        daily_goal: Number(dailyGoal),
        reps_per_set: Number(repsPerSet),
        start_date: today,
        end_date: endStr,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setProgram(data);
      setShowSetup(false);
    } else {
      const data = await res.json();
      setFormError(data.error || "Failed to create program");
    }
  };

  // Active program view
  if (program) {
    const progress = Math.min(program.reps_today / program.daily_goal, 1);
    const totalSetsNeeded = Math.ceil(
      program.daily_goal / program.reps_per_set,
    );
    const isComplete = program.reps_today >= program.daily_goal;

    // SVG ring calculations
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);

    return (
      <div className="gtg-page">
        <div className="gtg-header">
          <h2>Grease the Groove</h2>
          <button className="btn btn--ghost btn--sm" onClick={endProgram}>
            End Program
          </button>
        </div>

        <div className="gtg-exercise-name">{program.exercise_name}</div>

        <div
          className="gtg-ring-container"
          onClick={!isComplete ? logSet : undefined}
        >
          <svg viewBox="0 0 200 200" className="gtg-ring">
            <circle cx="100" cy="100" r={radius} className="gtg-ring-bg" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              className={`gtg-ring-progress ${isComplete ? "gtg-ring-progress--complete" : ""}`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="gtg-ring-text">
            <div className="gtg-reps-count">{program.reps_today}</div>
            <div className="gtg-reps-goal">of {program.daily_goal}</div>
            {isComplete && <div className="gtg-complete-label">Done!</div>}
          </div>
        </div>

        {!isComplete && (
          <button
            className="btn btn--primary gtg-log-btn"
            onClick={logSet}
            disabled={loading}
          >
            + {program.reps_per_set} reps
          </button>
        )}

        <div className="gtg-meta">
          <span className="badge badge--primary">
            {program.sets_today} of {totalSetsNeeded} sets
          </span>
          <span className="badge">{program.reps_per_set} reps per set</span>
        </div>

        {program.sets_today > 0 && (
          <button
            className="btn btn--ghost btn--sm gtg-undo-btn"
            onClick={undoSet}
            disabled={loading}
          >
            Undo last set
          </button>
        )}

        {isComplete && (
          <div className="gtg-complete-msg">
            You hit your daily goal! Rest up and come back tomorrow.
          </div>
        )}
      </div>
    );
  }

  // Setup / empty state
  if (showSetup) {
    return (
      <div className="gtg-page">
        <h2>Set Up Grease the Groove</h2>
        <p className="gtg-description">
          Pick one exercise to practice throughout the day with low-rep sets.
          Hit your daily goal, then let it reset tomorrow.
        </p>

        <form className="form-stack" onSubmit={handleCreateProgram}>
          {formError && <div className="form-error">{formError}</div>}

          <label className="form-label">
            Exercise
            <select
              className="form-input"
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
              required
            >
              <option value="">Select an exercise…</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Daily rep goal
            <input
              type="number"
              className="form-input"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              min={1}
              required
            />
          </label>

          <label className="form-label">
            Reps per set
            <input
              type="number"
              className="form-input"
              value={repsPerSet}
              onChange={(e) => setRepsPerSet(e.target.value)}
              min={1}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              Start Program
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setShowSetup(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="gtg-page">
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            width="48"
            height="48"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h2>Grease the Groove</h2>
        <p>
          Pick one exercise and practice it throughout the day with small sets.
          Build volume without fatigue.
        </p>
        <button className="btn btn--primary" onClick={() => setShowSetup(true)}>
          Set Up GTG Program
        </button>
      </div>
    </div>
  );
}
