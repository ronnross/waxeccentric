import { NextRequest, NextResponse } from "next/server";
import {
  deleteSection,
  getRoutineDetail,
  updateSection,
} from "@/lib/db/queries/routines";
import { updateSectionSchema } from "@/lib/schemas/routine";
import { formatZodErrors } from "@/lib/utils";

type Params = { params: Promise<{ id: string; sectionId: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id, sectionId } = await params;
  const body = await request.json();
  const parsed = updateSectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
  }

  const updated = updateSection(Number(sectionId), parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  const routine = getRoutineDetail(Number(id));
  return NextResponse.json(routine);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id, sectionId } = await params;
  const deleted = deleteSection(Number(sectionId));
  if (!deleted) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  const routine = getRoutineDetail(Number(id));
  return NextResponse.json(routine);
}
