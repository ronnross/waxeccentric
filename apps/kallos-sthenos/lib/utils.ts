export function formatSetsReps(
  sets: number | null,
  reps: number | null,
  durationSeconds: number | null,
  perSide?: boolean,
): string {
  const parts: string[] = [];
  if (sets) parts.push(`${sets} sets`);
  if (reps) parts.push(`${reps} reps`);
  if (durationSeconds) parts.push(`${durationSeconds}s`);
  if (perSide) parts.push("per side");
  return parts.join(" × ") || "—";
}

export function formatSectionMeta(
  format: string,
  config: Record<string, unknown> | null,
): string {
  switch (format) {
    case "emom":
      return config?.duration_minutes
        ? `EMOM ${config.duration_minutes} min`
        : "EMOM";
    case "rounds": {
      const rounds = config?.rounds as number | undefined;
      return rounds ? `${rounds} round${rounds > 1 ? "s" : ""}` : "Rounds";
    }
    case "superset":
      return "Superset";
    case "tabata": {
      const work = config?.work_seconds as number | undefined;
      const rest = config?.rest_seconds as number | undefined;
      const rounds = config?.rounds as number | undefined;
      const parts: string[] = ["Tabata"];
      if (work && rest) parts.push(`${work}s/${rest}s`);
      if (rounds) parts.push(`×${rounds}`);
      return parts.join(" ");
    }
    case "ladder": {
      const rungs = config?.rungs as number | undefined;
      return rungs ? `Ladder × ${rungs} rungs` : "Ladder";
    }
    default:
      return "";
  }
}

export function getRirBucketLabel(rir: number | null): string | null {
  if (rir === null) return null;
  if (rir >= 4) return "Easy";
  if (rir >= 2) return "About right";
  return "Hard";
}

export function formatRirBadge(rir: number | null): string | null {
  const bucket = getRirBucketLabel(rir);
  return bucket ? `Effort: ${bucket}` : null;
}

export function formatLadderReps(repsLadder: number[]): string {
  return repsLadder.join(" → ");
}

export function formatZodErrors(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): {
  error: string;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field =
      issue.path.length > 0 ? issue.path.map(String).join(".") : "input";
    fieldErrors[field] = issue.message;
  }
  const lines = Object.entries(fieldErrors).map(
    ([field, msg]) => `${field}: ${msg}`,
  );
  return { error: lines.join("; "), fieldErrors };
}

export function todayISO(): string {
  return localDateISO(new Date());
}

export function localDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
