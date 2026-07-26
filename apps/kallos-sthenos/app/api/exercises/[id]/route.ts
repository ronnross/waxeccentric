import { NextRequest, NextResponse } from "next/server";
import {
  deleteExercise,
  getExercise,
  updateExercise,
} from "@/lib/db/queries/exercises";
import { updateExerciseSchema } from "@/lib/schemas/exercise";
import { formatZodErrors } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const exercise = getExercise(Number(id));
  if (!exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }
  return NextResponse.json(exercise);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateExerciseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  const exercise = updateExercise(Number(id), parsed.data);
  if (!exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }
  return NextResponse.json(exercise);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const deleted = deleteExercise(Number(id));
    if (!deleted) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 },
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json(
        { error: "Cannot delete exercise that is used in a routine" },
        { status: 409 },
      );
    }
    throw err;
  }
}
