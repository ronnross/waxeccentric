import { notFound } from "next/navigation";
import { getExercise } from "@/lib/db/queries/exercises";
import ExerciseDetailClient from "./ExerciseDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function ExerciseDetailPage({ params }: Props) {
  const { id } = await params;
  const exercise = getExercise(Number(id));

  if (!exercise) notFound();

  return <ExerciseDetailClient exercise={exercise} />;
}
