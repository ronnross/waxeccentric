import { NextRequest, NextResponse } from "next/server";
import {
  removeExerciseFromSection,
  updateSectionExercise,
} from "@/lib/db/queries/routines";
import { updateSectionExerciseSchema } from "@/lib/schemas/routine";
import { formatZodErrors } from "@/lib/utils";

type Params = { params: Promise<{ id: string; exerciseId: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { exerciseId } = await params;
  const body = await request.json();
  const parsed = updateSectionExerciseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  const updated = updateSectionExercise(Number(exerciseId), parsed.data);
  if (!updated) {
    return NextResponse.json(
      { error: "Exercise entry not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { exerciseId } = await params;
  const deleted = removeExerciseFromSection(Number(exerciseId));
  if (!deleted) {
    return NextResponse.json(
      { error: "Exercise entry not found" },
      { status: 404 },
    );
  }
  return new NextResponse(null, { status: 204 });
}
