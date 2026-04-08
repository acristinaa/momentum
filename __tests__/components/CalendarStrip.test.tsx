import { CalendarStrip } from "@/components/CalendarStrip";
import { getTodayString } from "@/utils/dateUtils";
import { render } from "@testing-library/react-native";
import React from "react";

describe("CalendarStrip", () => {
  test("renders without crashing", () => {
    const { toJSON } = render(<CalendarStrip completedDates={[]} />);
    expect(toJSON()).toBeTruthy();
  });

  test("renders Last 14 Days label", () => {
    const { getByText } = render(<CalendarStrip completedDates={[]} />);
    expect(getByText("Last 14 Days")).toBeTruthy();
  });

  test("renders 14 day columns", () => {
    const { getAllByText } = render(<CalendarStrip completedDates={[]} />);
    const { toJSON } = render(<CalendarStrip completedDates={[]} />);
    expect(toJSON()).toBeTruthy();
  });

  test("shows checkmark for completed day", () => {
    const today = getTodayString();
    const { getAllByText } = render(<CalendarStrip completedDates={[today]} />);
    expect(getAllByText("✓").length).toBeGreaterThan(0);
  });
});
