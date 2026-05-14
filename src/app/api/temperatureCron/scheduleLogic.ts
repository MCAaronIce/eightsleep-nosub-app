/**
 * Given a list of sorted schedule entries and the current time, return the
 * temperature that should be active (the most recent schedule entry before
 * now).
 */
export function getTargetTemperatureFromSchedules(
  schedules: Array<{ time: string; temperature: number }>,
  now: Date,
): { targetLevel: number | null; stage: string } {
  if (schedules.length === 0) {
    return { targetLevel: null, stage: "no-schedule" };
  }

  const sorted = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

  let activeSchedule: { time: string; temperature: number } | null = null;
  for (const schedule of sorted) {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const scheduleDate = new Date(now);
    scheduleDate.setHours(hours!, minutes!, 0, 0);
    if (scheduleDate <= now) {
      activeSchedule = schedule;
    }
  }

  if (activeSchedule) {
    return {
      targetLevel: activeSchedule.temperature,
      stage: `schedule-${activeSchedule.time}`,
    };
  }

  return { targetLevel: null, stage: "before-first-schedule" };
}