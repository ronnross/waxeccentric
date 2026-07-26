import { NextRequest, NextResponse } from "next/server";
import { getLogsForSchedule, logSet } from "@/lib/db/queries/workoutLogs";
import { createWorkoutLogSchema } from "@/lib/schemas/workoutLog";
import { formatZodErrors } from "@/lib/utils";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scheduleId = searchParams.get("schedule_id");

  if (!scheduleId) {
    return NextResponse.json(
      { error: "Provide ?schedule_id=N" },
      { status: 400 },
    );
  }

  const logs = getLogsForSchedule(Number(scheduleId));
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createWorkoutLogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  try {
    const log = logSet(parsed.data);
    return NextResponse.json(log, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json(
        { error: "Schedule or exercise entry not found" },
        { status: 404 },
      );
    }
    throw err;
  }
}
