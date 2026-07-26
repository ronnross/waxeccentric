"use client";

import { useCallback, useEffect, useState } from "react";
import { appPath } from "@/lib/base-path";

interface VolumeEntry {
  muscle_group: string;
  total_sets: number;
}

const THRESHOLD = 10;

export default function WeeklyVolumeTracker({
  mondayISO,
  sundayISO,
}: {
  mondayISO: string;
  sundayISO: string;
}) {
  const [volume, setVolume] = useState<VolumeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVolume = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        appPath(`/api/volume?from=${mondayISO}&to=${sundayISO}`),
      );
      if (res.ok) {
        setVolume(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [mondayISO, sundayISO]);

  useEffect(() => {
    fetchVolume();
  }, [fetchVolume]);

  if (loading) return null;
  if (volume.length === 0) return null;

  return (
    <div className="card volume-tracker">
      <h3 className="volume-tracker__title">Weekly Volume</h3>
      <p className="volume-tracker__subtitle">
        Sets per muscle group (target: {THRESHOLD}/week)
      </p>
      {volume.map((v) => {
        const pct = Math.min((v.total_sets / THRESHOLD) * 100, 100);
        const level =
          v.total_sets >= THRESHOLD ? "met" : v.total_sets >= 5 ? "mid" : "low";

        return (
          <div key={v.muscle_group} className="volume-row">
            <span className="volume-row__label">{v.muscle_group}</span>
            <div className="volume-row__bar">
              <div
                className={`volume-row__fill volume-row__fill--${level}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="volume-row__count">
              {v.total_sets}/{THRESHOLD}
            </span>
          </div>
        );
      })}
    </div>
  );
}
