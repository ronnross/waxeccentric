import { NextRequest, NextResponse } from "next/server";
import {
  deleteSchedule,
  getScheduleEntry,
  updateSchedule,
} from "@/lib/db/queries/schedule";
import { updateScheduleSchema } from "@/lib/schemas/schedule";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateScheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const existing = getScheduleEntry(Number(id));
  if (!existing) {
    return NextResponse.json(
      { error: "Scheduled routine not found" },
      { status: 404 },
    );
  }

  updateSchedule(Number(id), parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deleted = deleteSchedule(Number(id));
  if (!deleted) {
    return NextResponse.json(
      { error: "Scheduled routine not found" },
      { status: 404 },
    );
  }
  return new NextResponse(null, { status: 204 });
}
