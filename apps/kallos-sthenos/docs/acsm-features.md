# Feature Ideas from 2026 ACSM Position Stand

Based on the [ACSM Position Stand: Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults](https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx) (April 2026), an overview of 137 systematic reviews covering 30,000+ participants.

---

## 1. Weekly Volume Tracker

**Evidence:** Hypertrophy is enhanced by ≥10 sets per muscle group per week, with diminishing returns around 18–20 weekly sets. For strength, 2–3 sets per exercise is the sweet spot.

**Feature:** A dashboard widget showing total weekly sets per muscle group, calculated from completed scheduled routines. Visual indicators (progress bars or color coding) for hitting the ≥10 set/week hypertrophy threshold per muscle group.

**Data needed:** Aggregate `sets` from `section_exercises` across completed `scheduled_routines` for the current week, grouped by `muscle_group` from the `exercises` table.

---

## 2. RIR (Reps in Reserve) Logging

**Evidence:** Training to failure is not necessary for strength or hypertrophy gains. A target of 2–3 reps in reserve (RIR) provides sufficient stimulus while reducing injury risk and fatigue.

**Feature:** Add an optional `rir` field (integer, 0–5) to section exercises. When logging a workout, users can record how many reps they had left in the tank. Over time, this helps gauge effort calibration and progressive overload without chasing failure.

**Schema change:** Add `rir` column to `section_exercises` table (nullable integer).

---

## 3. Exercise Priority / Order Guidance

**Evidence:** Exercises performed at the beginning of a training session produce significantly greater strength gains than the same exercises performed later.

**Feature:** Allow users to flag a "priority" exercise within a routine. The app could display a subtle indicator or tip when a priority exercise is not positioned first in a section. This is informational, not enforced — just a nudge.

**Implementation:** Add an optional `priority` boolean to `section_exercises`, or simply surface a tip in the UI based on exercise position within a section.

---

## 4. Progressive Overload Tracking

**Evidence:** Progressive overload — incrementally increasing the training stimulus (load, volume, frequency) — is the fundamental principle for continued adaptation.

**Feature:** A per-exercise history view showing load and reps over time. When viewing an exercise, display a simple chart or table of recent performances. Highlight when load or volume has increased versus plateaued.

**Data needed:** A new `workout_log` or `exercise_log` table to record actual weight/reps performed per exercise per scheduled workout, separate from the prescribed values in the routine.

---

## 5. Minimum Effective Dose Indicator

**Evidence:** The Position Stand emphasizes that _any_ RT is far better than none, and that minimal doses bring substantial gains. The key minimums: ≥2 sessions/week, ≥2 sets per exercise, all major muscle groups engaged.

**Feature:** A weekly "coverage check" on the dashboard:
- **Frequency:** Are you scheduled for ≥2 RT sessions this week?
- **Volume:** Does each routine have ≥2 sets per exercise?
- **Muscle groups:** Are all major groups (upper push, upper pull, lower, core) hit at least once this week?

Display as a simple checklist or traffic-light indicator. Green when minimums are met, amber when partially met.

---

## Priority Recommendation

**Start with #1 (Weekly Volume Tracker)** — it uses existing data (sets, muscle groups, scheduled routines), requires no schema changes, and delivers the most actionable insight from the research. The ≥10 sets/week threshold is a clear, evidence-based target users can act on immediately.
