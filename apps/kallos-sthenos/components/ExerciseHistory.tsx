"use client";

import { useCallback, useEffect, useState } from "react";
import { appPath } from "@/lib/base-path";

interface HistoryEntry {
  date: string;
  set_number: number;
  weight: number | null;
  reps: number | null;
  rir: number | null;
}

export default function ExerciseHistory({
  exerciseId,
}: {
  exerciseId: number;
}) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(
        appPath(`/api/exercises/${exerciseId}/history?limit=30`),
      );
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) return null;
  if (history.length === 0) return null;

  // Group by date for display
  const byDate = new Map<string, HistoryEntry[]>();
  for (const entry of history) {
    const dateStr = entry.date ?? "Unknown";
    const group = byDate.get(dateStr) ?? [];
    group.push(entry);
    byDate.set(dateStr, group);
  }

  return (
    <div className="exercise-history">
      <h3 className="exercise-history__title">Performance History</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Set</th>
            <th>Weight</th>
            <th>Reps</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(byDate.entries()).map(([date, sets]) =>
            sets.map((s, i) => (
              <tr key={`${date}-${s.set_number}`}>
                {i === 0 ? <td rowSpan={sets.length}>{date}</td> : null}
                <td>{s.set_number}</td>
                <td>{s.weight ?? "—"}</td>
                <td>{s.reps ?? "—"}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
