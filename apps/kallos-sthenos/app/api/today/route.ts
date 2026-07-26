import { NextResponse } from "next/server";
import { getTodaySchedule } from "@/lib/db/queries/schedule";

export function GET() {
  const schedule = getTodaySchedule();
  return NextResponse.json(schedule);
}
