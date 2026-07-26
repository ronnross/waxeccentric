import { describe, expect, it } from "vitest";
import { formatRirBadge, formatSetsReps, getRirBucketLabel } from "@/lib/utils";

describe("formatSetsReps", () => {
  it("returns em dash when no values are provided", () => {
    expect(formatSetsReps(null, null, null)).toBe("—");
  });

  it("formats sets and reps", () => {
    expect(formatSetsReps(3, 10, null)).toBe("3 sets × 10 reps");
  });

  it("includes per side label", () => {
    expect(formatSetsReps(3, 8, null, true)).toBe("3 sets × 8 reps × per side");
  });
});

describe("RIR bucket helpers", () => {
  it("groups lower RIR values as hard", () => {
    expect(getRirBucketLabel(1)).toBe("Hard");
    expect(getRirBucketLabel(0)).toBe("Hard");
  });

  it("groups middle RIR values as about right", () => {
    expect(getRirBucketLabel(2)).toBe("About right");
    expect(getRirBucketLabel(3)).toBe("About right");
  });

  it("groups higher RIR values as easy", () => {
    expect(getRirBucketLabel(4)).toBe("Easy");
    expect(getRirBucketLabel(5)).toBe("Easy");
  });

  it("formats the visible badge label", () => {
    expect(formatRirBadge(3)).toBe("Effort: About right");
    expect(formatRirBadge(null)).toBeNull();
  });
});
