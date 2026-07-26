"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { appPath } from "@/lib/base-path";
import { localDateISO, todayISO } from "@/lib/utils";

interface RoutineSummary {
  id: number;
  name: string;
}

interface ScheduleEntry {
  schedule_id: number;
  date: string;
  completed: boolean;
  notes: string | null;
  routine: { id: number; name: string } | null;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthGrid(year: number, month: number) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday-start: 0=Mon .. 6=Sun
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: { date: Date; iso: string; inMonth: boolean }[] = [];

  // Leading days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ date: d, iso: localDateISO(d), inMonth: false });
  }

  // Days in month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    cells.push({ date: d, iso: localDateISO(d), inMonth: true });
  }

  // Trailing days to fill last row
  while (cells.length % 7 !== 0) {
    const d = new Date(
      year,
      month + 1,
      cells.length - startDow - daysInMonth + 1,
    );
    cells.push({ date: d, iso: localDateISO(d), inMonth: false });
  }

  return cells;
}

export default function SchedulePage() {
  const router = useRouter();
  const today = todayISO();
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthEntries, setMonthEntries] = useState<ScheduleEntry[]>([]);
  const [routines, setRoutines] = useState<RoutineSummary[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [rescheduleEntry, setRescheduleEntry] = useState<ScheduleEntry | null>(
    null,
  );
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cells = getMonthGrid(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const loadMonth = useCallback(async (y: number, m: number) => {
    const grid = getMonthGrid(y, m);
    const from = grid[0]?.iso ?? localDateISO(new Date(y, m, 1));
    const to =
      grid[grid.length - 1]?.iso ?? localDateISO(new Date(y, m + 1, 0));
    const res = await fetch(appPath(`/api/schedule?from=${from}&to=${to}`));
    if (res.ok) setMonthEntries(await res.json());
  }, []);

  async function loadRoutines() {
    const res = await fetch(appPath("/api/routines"));
    if (res.ok) setRoutines(await res.json());
  }

  useEffect(() => {
    loadMonth(viewYear, viewMonth);
    loadRoutines();
  }, [viewYear, viewMonth, loadMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function goToToday() {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(todayISO());
  }

  // Group entries by date
  const entriesByDate: Record<string, ScheduleEntry[]> = {};
  for (const e of monthEntries) {
    if (!entriesByDate[e.date]) entriesByDate[e.date] = [];
    entriesByDate[e.date].push(e);
  }

  const selectedEntries = entriesByDate[selectedDate] || [];

  async function handleSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      routine_id: Number(form.get("routine_id")),
      date: selectedDate,
      notes: form.get("notes") || undefined,
    };

    const res = await fetch(appPath("/api/schedule"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to schedule");
      setSubmitting(false);
      return;
    }

    setShowAdd(false);
    setSubmitting(false);
    loadMonth(viewYear, viewMonth);
  }

  async function handleToggleComplete(
    scheduleId: number,
    currentlyCompleted: boolean,
  ) {
    await fetch(appPath(`/api/schedule/${scheduleId}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentlyCompleted }),
    });
    loadMonth(viewYear, viewMonth);
  }

  async function handleDelete(scheduleId: number) {
    if (!confirm("Remove this scheduled routine?")) return;
    await fetch(appPath(`/api/schedule/${scheduleId}`), { method: "DELETE" });
    loadMonth(viewYear, viewMonth);
  }

  async function handleReschedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rescheduleEntry || !rescheduleDate) return;
    setSubmitting(true);
    setError("");

    const res = await fetch(
      appPath(`/api/schedule/${rescheduleEntry.schedule_id}`),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: rescheduleDate }),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to reschedule");
      setSubmitting(false);
      return;
    }

    setRescheduleEntry(null);
    setRescheduleDate("");
    setSubmitting(false);
    loadMonth(viewYear, viewMonth);
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Schedule</h2>
        <button className="btn btn--primary" onClick={() => setShowAdd(true)}>
          + Schedule
        </button>
      </div>

      {/* Calendar header */}
      <div className="cal-header">
        <button
          className="btn btn--ghost"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="cal-header__title">
          <span>{monthLabel}</span>
          {(viewYear !== new Date().getFullYear() ||
            viewMonth !== new Date().getMonth()) && (
            <button className="btn btn--ghost btn--sm" onClick={goToToday}>
              Today
            </button>
          )}
        </div>
        <button
          className="btn btn--ghost"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="cal-grid cal-weekdays">
        {WEEKDAYS.map((d) => (
          <div key={d} className="cal-weekday">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="cal-grid cal-days">
        {cells.map((cell) => {
          const dayEntries = entriesByDate[cell.iso] || [];
          const isSelected = cell.iso === selectedDate;
          const isToday = cell.iso === today;

          return (
            <button
              key={cell.iso}
              className={[
                "cal-day",
                !cell.inMonth && "cal-day--outside",
                isSelected && "cal-day--selected",
                isToday && "cal-day--today",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedDate(cell.iso)}
            >
              <span className="cal-day__num">{cell.date.getDate()}</span>
              {dayEntries.length > 0 && (
                <div className="cal-day__pills">
                  {dayEntries.slice(0, 2).map((entry) => (
                    <span
                      key={entry.schedule_id}
                      className={`cal-pill${entry.completed ? " cal-pill--done" : ""}`}
                    >
                      {entry.routine?.name ?? "?"}
                    </span>
                  ))}
                  {dayEntries.length > 2 && (
                    <span className="cal-pill cal-pill--more">
                      +{dayEntries.length - 2}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      <div className="cal-detail">
        <h3 className="cal-detail__title">
          {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>

        {selectedEntries.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            No routines scheduled for this day.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {selectedEntries.map((entry) => (
              <div key={entry.schedule_id} className="card">
                <div className="card-header">
                  <h4 className="card-title">
                    {entry.routine ? (
                      <Link href={`/routines/${entry.routine.id}`}>
                        {entry.routine.name}
                      </Link>
                    ) : (
                      "Unknown routine"
                    )}
                  </h4>
                  <span
                    className={`badge ${entry.completed ? "badge--success" : "badge--warning"}`}
                  >
                    {entry.completed ? "Done" : "Pending"}
                  </span>
                </div>
                {entry.notes && (
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.8125rem",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    {entry.notes}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-sm)",
                    marginTop: "var(--space-sm)",
                  }}
                >
                  {entry.routine && (
                    <button
                      className="btn btn--secondary"
                      style={{ fontSize: "0.8125rem" }}
                      onClick={() =>
                        router.push(`/routines/${entry.routine!.id}`)
                      }
                    >
                      View Routine
                    </button>
                  )}
                  <button
                    className={`btn btn--${entry.completed ? "secondary" : "primary"}`}
                    style={{ fontSize: "0.8125rem" }}
                    onClick={() =>
                      handleToggleComplete(entry.schedule_id, entry.completed)
                    }
                  >
                    {entry.completed ? "Undo Complete" : "Mark Complete"}
                  </button>
                  <button
                    className="btn btn--secondary"
                    style={{ fontSize: "0.8125rem" }}
                    onClick={() => {
                      setRescheduleEntry(entry);
                      setRescheduleDate(entry.date);
                      setError("");
                    }}
                  >
                    Reschedule
                  </button>
                  <button
                    className="btn btn--ghost"
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-danger)",
                    }}
                    onClick={() => handleDelete(entry.schedule_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule modal */}
      {showAdd && (
        <div
          className="schedule-modal-backdrop"
          onClick={() => setShowAdd(false)}
        >
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal__header">
              <h3 className="schedule-modal__title">
                Schedule for{" "}
                {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </h3>
              <button
                className="schedule-modal__close"
                onClick={() => setShowAdd(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSchedule}
              className="form-stack"
              style={{ padding: "var(--space-md)" }}
            >
              <div className="form-group">
                <label htmlFor="routine_id" className="form-label">
                  Routine *
                </label>
                <select
                  id="routine_id"
                  name="routine_id"
                  required
                  className="form-select"
                >
                  <option value="">Select a routine...</option>
                  {routines.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <input
                  id="notes"
                  name="notes"
                  className="form-input"
                  placeholder="Optional day-specific notes"
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn--primary"
                >
                  {submitting ? "Scheduling..." : "Schedule"}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule modal */}
      {rescheduleEntry && (
        <div
          className="schedule-modal-backdrop"
          onClick={() => setRescheduleEntry(null)}
        >
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal__header">
              <h3 className="schedule-modal__title">
                Reschedule {rescheduleEntry.routine?.name ?? "Routine"}
              </h3>
              <button
                className="schedule-modal__close"
                onClick={() => setRescheduleEntry(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleReschedule}
              className="form-stack"
              style={{ padding: "var(--space-md)" }}
            >
              <div className="form-group">
                <label htmlFor="reschedule-date" className="form-label">
                  New Date *
                </label>
                <input
                  id="reschedule-date"
                  type="date"
                  required
                  className="form-input"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={
                    submitting || rescheduleDate === rescheduleEntry.date
                  }
                  className="btn btn--primary"
                >
                  {submitting ? "Rescheduling..." : "Reschedule"}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setRescheduleEntry(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
