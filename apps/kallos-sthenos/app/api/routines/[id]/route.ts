import { NextRequest, NextResponse } from "next/server";
import {
  deleteRoutine,
  getRoutineDetail,
  updateRoutine,
} from "@/lib/db/queries/routines";
import { updateRoutineSchema } from "@/lib/schemas/routine";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const routine = getRoutineDetail(Number(id));
  if (!routine) {
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });
  }
  return NextResponse.json(routine);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateRoutineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const routine = updateRoutine(Number(id), parsed.data);
  if (!routine) {
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });
  }
  return NextResponse.json(routine);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deleted = deleteRoutine(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
