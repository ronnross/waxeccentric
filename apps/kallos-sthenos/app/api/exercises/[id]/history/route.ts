import { NextRequest, NextResponse } from "next/server";
import { getExerciseHistory } from "@/lib/db/queries/workoutLogs";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const limit = searchParams.get("limit");

  const history = getExerciseHistory(
    Number(id),
    limit ? Number(limit) : undefined,
  );
  return NextResponse.json(history);
}
