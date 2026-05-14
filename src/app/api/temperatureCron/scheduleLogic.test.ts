import { describe, it, expect } from "vitest";
import { getTargetTemperatureFromSchedules } from "./scheduleLogic";

describe("getTargetTemperatureFromSchedules", () => {
  const baseDate = new Date("2024-01-01T00:00:00.000Z");

  function at(hour: number, minute: number): Date {
    const d = new Date(baseDate);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  it("returns null when no schedules exist", () => {
    const result = getTargetTemperatureFromSchedules([], at(12, 0));
    expect(result.targetLevel).toBeNull();
    expect(result.stage).toBe("no-schedule");
  });

  it("picks the schedule that matches the current time exactly", () => {
    const schedules = [{ time: "22:00", temperature: -5 }];
    const result = getTargetTemperatureFromSchedules(schedules, at(22, 0));
    expect(result.targetLevel).toBe(-5);
    expect(result.stage).toBe("schedule-22:00");
  });

  it("picks the most recent schedule before now", () => {
    const schedules = [
      { time: "22:00", temperature: -5 },
      { time: "23:30", temperature: 3 },
    ];
    const result = getTargetTemperatureFromSchedules(schedules, at(23, 45));
    expect(result.targetLevel).toBe(3);
    expect(result.stage).toBe("schedule-23:30");
  });

  it("picks the earliest schedule if now is after all of them", () => {
    const schedules = [
      { time: "20:00", temperature: 0 },
      { time: "22:00", temperature: -5 },
    ];
    const result = getTargetTemperatureFromSchedules(schedules, at(23, 0));
    expect(result.targetLevel).toBe(-5);
  });

  it("returns null before the first schedule entry", () => {
    const schedules = [{ time: "22:00", temperature: -5 }];
    const result = getTargetTemperatureFromSchedules(schedules, at(21, 0));
    expect(result.targetLevel).toBeNull();
    expect(result.stage).toBe("before-first-schedule");
  });

  it("sorts unsorted schedules correctly", () => {
    const schedules = [
      { time: "03:00", temperature: 5 },
      { time: "01:00", temperature: 0 },
      { time: "02:00", temperature: 3 },
    ];
    const result = getTargetTemperatureFromSchedules(schedules, at(2, 30));
    expect(result.targetLevel).toBe(3);
    expect(result.stage).toBe("schedule-02:00");
  });

  it("handles many schedule entries", () => {
    const schedules = [
      { time: "21:00", temperature: 5 },
      { time: "22:00", temperature: 3 },
      { time: "23:00", temperature: 0 },
      { time: "00:00", temperature: -3 },
      { time: "01:00", temperature: -5 },
      { time: "02:00", temperature: -3 },
      { time: "03:00", temperature: 0 },
      { time: "04:00", temperature: 3 },
      { time: "05:00", temperature: 5 },
    ];
    expect(getTargetTemperatureFromSchedules(schedules, at(2, 30)).targetLevel).toBe(-3);
    expect(getTargetTemperatureFromSchedules(schedules, at(4, 15)).targetLevel).toBe(3);
    expect(getTargetTemperatureFromSchedules(schedules, at(0, 45)).targetLevel).toBe(-3);
  });
});
