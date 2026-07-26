import { NextRequest, NextResponse } from "next/server";
import { getWeeklyVolume } from "@/lib/db/queries/schedule";

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

  const volume = getWeeklyVolume(from, to);
  return NextResponse.json(volume);
}
