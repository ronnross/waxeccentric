import { NextRequest, NextResponse } from "next/server";
import { createExercise, listExercises } from "@/lib/db/queries/exercises";
import { createExerciseSchema } from "@/lib/schemas/exercise";
import { formatZodErrors } from "@/lib/utils";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const muscle_group = searchParams.get("muscle_group") ?? undefined;

  const exercises = listExercises({ category, muscle_group });
  return NextResponse.json(exercises);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createExerciseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  try {
    const exercise = createExercise(parsed.data);
    return NextResponse.json(exercise, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return NextResponse.json(
        { error: "An exercise with that name already exists" },
        { status: 409 },
      );
    }
    throw err;
  }
}
