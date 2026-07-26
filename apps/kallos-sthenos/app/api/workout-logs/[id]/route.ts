import { NextRequest, NextResponse } from "next/server";
import { deleteLog, updateLog } from "@/lib/db/queries/workoutLogs";
import { updateWorkoutLogSchema } from "@/lib/schemas/workoutLog";
import { formatZodErrors } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateWorkoutLogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  const updated = updateLog(Number(id), parsed.data);
  if (!updated) {
    return NextResponse.json(
      { error: "Workout log not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deleted = deleteLog(Number(id));
  if (!deleted) {
    return NextResponse.json(
      { error: "Workout log not found" },
      { status: 404 },
    );
  }
  return new NextResponse(null, { status: 204 });
}
