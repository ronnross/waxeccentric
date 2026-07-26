import { NextRequest, NextResponse } from "next/server";
import { getWeeklyComplianceData } from "@/lib/db/queries/schedule";

const MAJOR_GROUPS = ["upper push", "upper pull", "lower", "core"];

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Provide ?from=YYYY-MM-DD&to=YYYY-MM-DD" },
      { status: 400 },
    );
  }

  const data = getWeeklyComplianceData(from, to);

  const sessionsMet = data.sessions >= 2;
  const allExercisesHaveMinSets = data.lowSetExercises.length === 0;
  const missingGroups = MAJOR_GROUPS.filter(
    (g) => !data.coveredMuscleGroups.includes(g),
  );
  const allMajorGroupsCovered = missingGroups.length === 0;

  const metCount = [
    sessionsMet,
    allExercisesHaveMinSets,
    allMajorGroupsCovered,
  ].filter(Boolean).length;
  const overallStatus =
    metCount >= 3 ? "green" : metCount >= 2 ? "amber" : "red";

  return NextResponse.json({
    sessions: data.sessions,
    sessionsTarget: 2,
    sessionsMet,
    allExercisesHaveMinSets,
    lowSetExercises: data.lowSetExercises,
    coveredMuscleGroups: data.coveredMuscleGroups,
    missingMuscleGroups: missingGroups,
    allMajorGroupsCovered,
    majorGroups: MAJOR_GROUPS,
    overallStatus,
  });
}
