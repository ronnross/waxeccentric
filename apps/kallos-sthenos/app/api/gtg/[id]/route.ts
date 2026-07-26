import { NextRequest, NextResponse } from "next/server";
import {
  deactivateProgram,
  getProgram,
  logSet,
  undoLastSet,
} from "@/lib/db/queries/gtg";
import { logSetSchema } from "@/lib/schemas/gtg";
import { todayISO } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const programId = Number(id);
  if (Number.isNaN(programId)) {
    return NextResponse.json({ error: "Invalid program ID" }, { status: 400 });
  }

  const program = getProgram(programId);
  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = logSetSchema.safeParse(body);
  const date = parsed.success ? parsed.data.date : todayISO();

  const result = logSet(programId, date);
  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const programId = Number(id);
  if (Number.isNaN(programId)) {
    return NextResponse.json({ error: "Invalid program ID" }, { status: 400 });
  }

  const ok = deactivateProgram(programId);
  if (!ok) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const programId = Number(id);
  if (Number.isNaN(programId)) {
    return NextResponse.json({ error: "Invalid program ID" }, { status: 400 });
  }

  const body = await request.json();

  if (body.action === "undo") {
    const date = body.date || todayISO();
    const result = undoLastSet(programId, date);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
