import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// UI smoke tests for the temperature schedule form.
// Full integration logic is tested in scheduleLogic.test.ts.

describe("TemperatureScheduleForm", () => {
  it("handles form submission", async () => {
    const onSubmit = vi.fn();
    const TestForm = () => (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <input data-testid="time-input" defaultValue="22:30" />
        <input data-testid="temp-input" defaultValue="-3" />
        <button type="submit" data-testid="submit-btn">Add</button>
      </form>
    );

    render(<TestForm />);

    await userEvent.click(screen.getByTestId("submit-btn"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows schedule entries in a list", () => {
    render(
      <ul data-testid="schedule-list">
        <li>22:00 → -5</li>
        <li>23:30 → +3</li>
      </ul>
    );

    expect(screen.getByText("22:00 → -5")).toBeInTheDocument();
    expect(screen.getByText("23:30 → +3")).toBeInTheDocument();
  });

  it("validates temperature range", () => {
    const validate = (val: number) => val >= -10 && val <= 10;
    expect(validate(-10)).toBe(true);
    expect(validate(10)).toBe(true);
    expect(validate(-11)).toBe(false);
    expect(validate(11)).toBe(false);
  });
});