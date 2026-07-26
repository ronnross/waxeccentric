import EditRoutineClient from "./EditRoutineClient";

type Props = { params: Promise<{ id: string }> };

export default async function EditRoutinePage({ params }: Props) {
  const { id } = await params;
  return <EditRoutineClient routineId={Number(id)} />;
}
