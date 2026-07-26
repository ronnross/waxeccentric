"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionExercise } from "@/lib/schemas/routine";
import { formatSetsReps } from "@/lib/utils";

interface EmomTimerProps {
  durationMinutes: number;
  groups: { group: string | null; exercises: SectionExercise[] }[];
}

type TimerState = "idle" | "running" | "paused" | "finished";

export default function EmomTimer({ durationMinutes, groups }: EmomTimerProps) {
  const [state, setState] = useState<TimerState>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const prevMinuteRef = useRef(-1);
  const warnedMinuteRef = useRef(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const totalMs = durationMinutes * 60 * 1000;

  // Determine named groups (ODD, EVEN, A, B, etc.)
  const namedGroups = groups.filter((g) => g.group !== null);
  const hasAlternating = namedGroups.length >= 2;

  const currentMinute = Math.floor(elapsedMs / 60000) + 1; // 1-indexed
  const secondsInMinute = Math.floor((elapsedMs % 60000) / 1000);
  const remainingInMinute = 59 - secondsInMinute;
  const totalRemaining = Math.max(0, totalMs - elapsedMs);
  const totalRemainingMin = Math.floor(totalRemaining / 60000);
  const totalRemainingSec = Math.floor((totalRemaining % 60000) / 1000);

  // Which group is active this minute
  const activeGroupIndex = hasAlternating
    ? (currentMinute - 1) % namedGroups.length
    : -1;
  const activeGroup = hasAlternating ? namedGroups[activeGroupIndex] : null;

  // Initialize or resume AudioContext (must be called from user gesture)
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Play a bell-like "ding" — uses harmonics + exponential decay
  const playDing = useCallback(
    (frequency: number, volume: number, duration: number) => {
      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        // Fundamental tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.value = frequency;
        gain1.gain.setValueAtTime(volume, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        // Harmonic overtone for bell character
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.value = frequency * 2.4; // inharmonic partial (bell-like)
        gain2.gain.setValueAtTime(volume * 0.3, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + duration);
        osc2.start(now);
        osc2.stop(now + duration * 0.6);
      } catch {
        // Audio not available
      }
    },
    [getAudioCtx],
  );

  // Beep/vibrate at minute boundaries
  const alertMinuteChange = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    playDing(880, 0.4, 0.6);
  }, [playDing]);

  // 10-second warning — quick double ding
  const alertTenSeconds = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 60, 50]);
    }
    playDing(587, 0.25, 0.25);
    setTimeout(() => playDing(587, 0.25, 0.25), 150);
  }, [playDing]);

  // Finish alert — triple ding ascending
  const alertFinish = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
    playDing(660, 0.4, 0.8);
    setTimeout(() => playDing(880, 0.4, 0.8), 300);
    setTimeout(() => playDing(1100, 0.5, 1.0), 600);
  }, [playDing]);

  // Core tick
  useEffect(() => {
    if (state === "running") {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;

        if (elapsed >= totalMs) {
          setElapsedMs(totalMs);
          setState("finished");
          if (intervalRef.current) clearInterval(intervalRef.current);
          alertFinish();
          return;
        }

        setElapsedMs(elapsed);

        // Check for minute boundary
        const min = Math.floor(elapsed / 60000);
        if (min !== prevMinuteRef.current && min > 0) {
          prevMinuteRef.current = min;
          alertMinuteChange();
        }

        // Check for 10-second warning (50 seconds into each minute)
        const secsInMin = Math.floor((elapsed % 60000) / 1000);
        if (secsInMin >= 50 && warnedMinuteRef.current !== min) {
          warnedMinuteRef.current = min;
          alertTenSeconds();
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state, totalMs, alertMinuteChange, alertFinish, alertTenSeconds]);

  function handleStart() {
    getAudioCtx(); // unlock audio on user gesture
    prevMinuteRef.current = 0;
    warnedMinuteRef.current = -1;
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setState("running");
    alertMinuteChange(); // ding at start
  }

  function handlePause() {
    pausedAtRef.current = elapsedMs;
    setState("paused");
  }

  function handleResume() {
    startTimeRef.current = Date.now() - pausedAtRef.current;
    setState("running");
  }

  function handleReset() {
    setState("idle");
    setElapsedMs(0);
    prevMinuteRef.current = -1;
    warnedMinuteRef.current = -1;
  }

  // Format mm:ss
  function fmt(ms: number) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Progress ring
  const minuteProgress = secondsInMinute / 60;
  const totalProgress = Math.min(elapsedMs / totalMs, 1);

  if (state === "idle") {
    return (
      <div className="emom-timer emom-timer--idle">
        <button
          className="btn btn--primary emom-start-btn"
          onClick={handleStart}
        >
          ▶ Start {durationMinutes} min EMOM
        </button>
      </div>
    );
  }

  return (
    <div className={`emom-timer emom-timer--${state}`}>
      {/* Top bar: minute + total */}
      <div className="emom-display">
        <div className="emom-ring-container">
          <svg viewBox="0 0 100 100" className="emom-ring">
            <circle cx="50" cy="50" r="44" className="emom-ring-bg" />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="emom-ring-progress"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - minuteProgress)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="emom-ring-text">
            <div className="emom-seconds">{remainingInMinute}</div>
            <div className="emom-label">sec left</div>
          </div>
        </div>

        <div className="emom-info">
          <div className="emom-minute-label">
            Minute {Math.min(currentMinute, durationMinutes)} of{" "}
            {durationMinutes}
          </div>
          {activeGroup && (
            <div className="emom-active-group">
              <span className="badge badge--primary">{activeGroup.group}</span>
            </div>
          )}
          <div className="emom-total-time">{fmt(totalRemaining)} remaining</div>
        </div>
      </div>

      {/* Active exercises */}
      {activeGroup && (
        <div className="emom-exercises">
          {activeGroup.exercises.map((ex) => (
            <div key={ex.id} className="emom-exercise-row">
              <span className="exercise-name">{ex.exercise.name}</span>
              <span className="exercise-meta">
                {formatSetsReps(null, ex.reps, ex.duration_seconds)}
                {ex.per_side && " per side"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* No alternating groups — show all exercises */}
      {!activeGroup && groups.length > 0 && (
        <div className="emom-exercises">
          {groups.flatMap((g) =>
            g.exercises.map((ex) => (
              <div key={ex.id} className="emom-exercise-row">
                <span className="exercise-name">{ex.exercise.name}</span>
                <span className="exercise-meta">
                  {formatSetsReps(null, ex.reps, ex.duration_seconds)}
                  {ex.per_side && " per side"}
                </span>
              </div>
            )),
          )}
        </div>
      )}

      {/* Total progress bar */}
      <div className="emom-progress-bar">
        <div
          className="emom-progress-fill"
          style={{ width: `${totalProgress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="emom-controls">
        {state === "running" && (
          <button className="btn btn--secondary" onClick={handlePause}>
            ⏸ Pause
          </button>
        )}
        {state === "paused" && (
          <button className="btn btn--primary" onClick={handleResume}>
            ▶ Resume
          </button>
        )}
        {state === "finished" && (
          <div className="emom-finished-msg">EMOM Complete!</div>
        )}
        <button className="btn btn--ghost" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
