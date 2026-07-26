import { NextRequest, NextResponse } from "next/server";
import { createProgram, getActiveProgram } from "@/lib/db/queries/gtg";
import { createGtgProgramSchema } from "@/lib/schemas/gtg";
import { formatZodErrors, todayISO } from "@/lib/utils";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date") || todayISO();

  const program = getActiveProgram(date);
  return NextResponse.json(program);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createGtgProgramSchema.safeParse(body);

  if (!parsed.success) {
    const { error, fieldErrors } = formatZodErrors(parsed.error);
    return NextResponse.json({ error, fieldErrors }, { status: 400 });
  }

  if (parsed.data.end_date < parsed.data.start_date) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 400 },
    );
  }

  try {
    const program = createProgram(parsed.data);
    return NextResponse.json(program, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("FOREIGN KEY constraint failed")
    ) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 },
      );
    }
    throw err;
  }
}
