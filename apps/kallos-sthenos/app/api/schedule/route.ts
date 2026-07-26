import { NextRequest, NextResponse } from "next/server";
import {
  createSchedule,
  getScheduleByDate,
  getScheduleByRange,
} from "@/lib/db/queries/schedule";
import { createScheduleSchema } from "@/lib/schemas/schedule";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (date) {
    const schedule = getScheduleByDate(date);
    return NextResponse.json(schedule);
  }

  if (from && to) {
    const schedule = getScheduleByRange(from, to);
    return NextResponse.json(schedule);
  }

  return NextResponse.json(
    { error: "Provide ?date=YYYY-MM-DD or ?from=...&to=..." },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createScheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const entry = createSchedule(parsed.data);
    return NextResponse.json(entry, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return NextResponse.json(
        { error: "This routine is already scheduled for that date" },
        { status: 409 },
      );
    }
    if (
      err instanceof Error &&
      err.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }
    throw err;
  }
}
