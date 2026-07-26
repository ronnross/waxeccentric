"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionExercise } from "@/lib/schemas/routine";
import { formatSetsReps } from "@/lib/utils";

interface TabataTimerProps {
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  exercises: SectionExercise[];
}

type TimerState = "idle" | "running" | "paused" | "finished";
type Phase = "work" | "rest";

export default function TabataTimer({
  workSeconds,
  restSeconds,
  rounds,
  exercises,
}: TabataTimerProps) {
  const [state, setState] = useState<TimerState>("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("work");
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Track which alerts have fired to avoid double-firing
  const lastAlertedRound = useRef(0);
  const lastAlertedPhase = useRef<Phase>("work");

  const workMs = workSeconds * 1000;
  const restMs = restSeconds * 1000;
  const roundMs = workMs + restMs;
  const totalMs = roundMs * rounds;

  // Derive current round and phase from elapsed time
  const getPosition = useCallback(
    (elapsed: number) => {
      if (elapsed >= totalMs)
        return {
          round: rounds,
          phase: "rest" as Phase,
          phaseElapsed: restMs,
          phaseTotal: restMs,
        };
      const roundIndex = Math.floor(elapsed / roundMs);
      const withinRound = elapsed - roundIndex * roundMs;
      if (withinRound < workMs) {
        return {
          round: roundIndex + 1,
          phase: "work" as Phase,
          phaseElapsed: withinRound,
          phaseTotal: workMs,
        };
      }
      return {
        round: roundIndex + 1,
        phase: "rest" as Phase,
        phaseElapsed: withinRound - workMs,
        phaseTotal: restMs,
      };
    },
    [restMs, roundMs, rounds, totalMs, workMs],
  );

  const pos = getPosition(elapsedMs);
  const phaseRemaining = Math.max(
    0,
    Math.ceil((pos.phaseTotal - pos.phaseElapsed) / 1000),
  );
  const totalRemaining = Math.max(0, totalMs - elapsedMs);
  const totalRemainingMin = Math.floor(totalRemaining / 60000);
  const totalRemainingSec = Math.floor((totalRemaining % 60000) / 1000);

  // Audio helpers (same approach as EmomTimer)
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playDing = useCallback(
    (frequency: number, volume: number, duration: number) => {
      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.value = frequency;
        gain1.gain.setValueAtTime(volume, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.value = frequency * 2.4;
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

  const alertWork = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    playDing(880, 0.4, 0.5);
  }, [playDing]);

  const alertRest = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 60, 50]);
    }
    playDing(440, 0.3, 0.4);
  }, [playDing]);

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

        const p = getPosition(elapsed);
        setCurrentRound(p.round);
        setPhase(p.phase);

        // Alert on phase transitions
        if (
          p.round !== lastAlertedRound.current ||
          p.phase !== lastAlertedPhase.current
        ) {
          lastAlertedRound.current = p.round;
          lastAlertedPhase.current = p.phase;
          if (p.phase === "work") {
            alertWork();
          } else {
            alertRest();
          }
        }
      }, 50);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state, totalMs, alertWork, alertRest, alertFinish, getPosition]);

  function handleStart() {
    getAudioCtx();
    lastAlertedRound.current = 1;
    lastAlertedPhase.current = "work";
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setCurrentRound(1);
    setPhase("work");
    setState("running");
    alertWork();
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
    setCurrentRound(1);
    setPhase("work");
    lastAlertedRound.current = 0;
    lastAlertedPhase.current = "work";
  }

  // Progress values
  const phaseProgress =
    pos.phaseTotal > 0 ? pos.phaseElapsed / pos.phaseTotal : 0;
  const totalProgress = Math.min(elapsedMs / totalMs, 1);

  const totalLabel = `${totalRemainingMin}:${totalRemainingSec.toString().padStart(2, "0")}`;

  if (state === "idle") {
    return (
      <div className="tabata-timer tabata-timer--idle">
        <button
          className="btn btn--primary tabata-start-btn"
          onClick={handleStart}
        >
          ▶ Start Tabata — {workSeconds}s/{restSeconds}s × {rounds}
        </button>
      </div>
    );
  }

  const isWork = state !== "finished" && pos.phase === "work";
  const phaseLabel = state === "finished" ? "Done!" : isWork ? "WORK" : "REST";

  return (
    <div
      className={`tabata-timer tabata-timer--${state} ${isWork ? "tabata-timer--work" : "tabata-timer--rest"}`}
    >
      <div className="tabata-display">
        <div className="tabata-ring-container">
          <svg viewBox="0 0 100 100" className="tabata-ring">
            <circle cx="50" cy="50" r="44" className="tabata-ring-bg" />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`tabata-ring-progress ${isWork ? "tabata-ring-progress--work" : "tabata-ring-progress--rest"}`}
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - phaseProgress)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="tabata-ring-text">
            <div className="tabata-seconds">{phaseRemaining}</div>
            <div
              className={`tabata-phase-label ${isWork ? "tabata-phase--work" : "tabata-phase--rest"}`}
            >
              {phaseLabel}
            </div>
          </div>
        </div>

        <div className="tabata-info">
          <div className="tabata-round-label">
            Round {Math.min(currentRound, rounds)} of {rounds}
          </div>
          <div className="tabata-config">
            {workSeconds}s work / {restSeconds}s rest
          </div>
          <div className="tabata-total-time">{totalLabel} remaining</div>
        </div>
      </div>

      {/* Exercise list */}
      {exercises.length > 0 && (
        <div className="tabata-exercises">
          {exercises.map((ex) => (
            <div key={ex.id} className="tabata-exercise-row">
              <span className="exercise-name">{ex.exercise.name}</span>
              <span className="exercise-meta">
                {formatSetsReps(null, ex.reps, ex.duration_seconds)}
                {ex.per_side && " per side"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total progress bar */}
      <div className="tabata-progress-bar">
        <div
          className="tabata-progress-fill"
          style={{ width: `${totalProgress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="tabata-controls">
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
          <div className="tabata-finished-msg">Tabata Complete!</div>
        )}
        <button className="btn btn--ghost" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
