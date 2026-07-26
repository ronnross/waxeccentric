import { NextRequest, NextResponse } from "next/server";
import {
  addExerciseToSection,
  getRoutineDetail,
} from "@/lib/db/queries/routines";
import { addSectionExerciseSchema } from "@/lib/schemas/routine";
import { formatZodErrors } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = addSectionExerciseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  try {
    addExerciseToSection(parsed.data);
    const routine = getRoutineDetail(Number(id));
    return NextResponse.json(routine, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return NextResponse.json(
        { error: "That position is already taken in this section" },
        { status: 409 },
      );
    }
    if (
      err instanceof Error &&
      err.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json(
        { error: "Exercise or section not found" },
        { status: 404 },
      );
    }
    throw err;
  }
}
