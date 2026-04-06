import {
  calculateStreak,
  getTodayString,
  isSameDay,
} from "../../utils/dateUtils";

describe("dateUtils", () => {
  test("getTodayString returns YYYY-MM-DD format", () => {
    const result = getTodayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("isSameDay returns true for same date", () => {
    expect(isSameDay("2024-01-15", "2024-01-15")).toBe(true);
  });

  test("isSameDay returns false for different dates", () => {
    expect(isSameDay("2024-01-15", "2024-01-16")).toBe(false);
  });

  test("calculateStreak returns 0 for empty array", () => {
    expect(calculateStreak([])).toBe(0);
  });

  test("calculateStreak counts consecutive days correctly", () => {
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    expect(calculateStreak([today, yesterdayStr])).toBe(2);
  });
});
