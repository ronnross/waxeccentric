import { NextRequest, NextResponse } from "next/server";
import { createRoutine, listRoutines } from "@/lib/db/queries/routines";
import { createRoutineSchema } from "@/lib/schemas/routine";

export function GET() {
  const routines = listRoutines();
  return NextResponse.json(routines);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createRoutineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const routine = createRoutine(parsed.data);
  return NextResponse.json(routine, { status: 201 });
}
