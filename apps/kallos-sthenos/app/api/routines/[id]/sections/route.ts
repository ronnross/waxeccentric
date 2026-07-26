import { NextRequest, NextResponse } from "next/server";
import {
  createSection,
  getRoutineDetail,
  swapSectionPositions,
} from "@/lib/db/queries/routines";
import { createSectionSchema } from "@/lib/schemas/routine";
import { formatZodErrors } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = createSectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  try {
    createSection(Number(id), parsed.data);
    const routine = getRoutineDetail(Number(id));
    return NextResponse.json(routine, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return NextResponse.json(
        { error: "That position is already taken" },
        { status: 409 },
      );
    }
    if (
      err instanceof Error &&
      err.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }
    throw err;
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { sectionIdA, sectionIdB } = body;

  if (!sectionIdA || !sectionIdB) {
    return NextResponse.json(
      { error: "sectionIdA and sectionIdB are required" },
      { status: 400 },
    );
  }

  const swapped = swapSectionPositions(
    Number(id),
    Number(sectionIdA),
    Number(sectionIdB),
  );
  if (!swapped) {
    return NextResponse.json({ error: "Sections not found" }, { status: 404 });
  }

  const routine = getRoutineDetail(Number(id));
  return NextResponse.json(routine);
}
