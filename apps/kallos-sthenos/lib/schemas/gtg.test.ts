import { describe, expect, it } from "vitest";
import { createGtgProgramSchema, logSetSchema } from "@/lib/schemas/gtg";

describe("createGtgProgramSchema", () => {
  it("accepts valid input", () => {
    const result = createGtgProgramSchema.safeParse({
      exercise_id: 1,
      daily_goal: 50,
      reps_per_set: 5,
      start_date: "2026-03-13",
      end_date: "2026-03-19",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing exercise_id", () => {
    const result = createGtgProgramSchema.safeParse({
      daily_goal: 50,
      reps_per_set: 5,
      start_date: "2026-03-13",
      end_date: "2026-03-19",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive daily_goal", () => {
    const result = createGtgProgramSchema.safeParse({
      exercise_id: 1,
      daily_goal: 0,
      reps_per_set: 5,
      start_date: "2026-03-13",
      end_date: "2026-03-19",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = createGtgProgramSchema.safeParse({
      exercise_id: 1,
      daily_goal: 50,
      reps_per_set: 5,
      start_date: "03-13-2026",
      end_date: "2026-03-19",
    });
    expect(result.success).toBe(false);
  });
});

describe("logSetSchema", () => {
  it("accepts valid date", () => {
    const result = logSetSchema.safeParse({ date: "2026-03-13" });
    expect(result.success).toBe(true);
  });

  it("rejects bad date format", () => {
    const result = logSetSchema.safeParse({ date: "not-a-date" });
    expect(result.success).toBe(false);
  });
});
