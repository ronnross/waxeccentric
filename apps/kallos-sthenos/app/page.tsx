import { getScheduleByDate, getTodaySchedule } from "@/lib/db/queries/schedule";
import { todayISO } from "@/lib/utils";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const today = todayISO();
  const params = await searchParams;

  // Use the date from URL params if provided, otherwise default to today
  const dateToShow = params.date || today;

  let schedule;
  if (dateToShow === today) {
    schedule = getTodaySchedule();
  } else {
    schedule = getScheduleByDate(dateToShow);
  }

  return (
    <DashboardClient initialSchedule={schedule} initialDate={dateToShow} />
  );
}
