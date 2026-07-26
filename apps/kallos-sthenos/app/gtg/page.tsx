import { listExercises } from "@/lib/db/queries/exercises";
import { getActiveProgram } from "@/lib/db/queries/gtg";
import { todayISO } from "@/lib/utils";
import GtgClient from "./GtgClient";

export const dynamic = "force-dynamic";

export default function GtgPage() {
  const today = todayISO();
  const program = getActiveProgram(today);
  const exercises = listExercises();

  return (
    <GtgClient initialProgram={program} exercises={exercises} today={today} />
  );
}
