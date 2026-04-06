import { Habit } from "../../types";
import { getTodayString } from "../../utils/dateUtils";
import {
  allCompletedToday,
  calculateTodayPoints,
} from "../../utils/habitUtils";

const today = getTodayString();

const makeHabit = (id: string, completedToday: boolean): Habit => ({
  id,
  title: `Habit ${id}`,
  createdAt: today,
  completedDates: completedToday ? [today] : [],
});

describe("habitUtils", () => {
  test("calculateTodayPoints gives 1 per completed habit", () => {
    const habits = [makeHabit("1", true), makeHabit("2", false)];
    expect(calculateTodayPoints(habits)).toBe(1);
  });

  test("calculateTodayPoints gives bonus when all complete", () => {
    const habits = [makeHabit("1", true), makeHabit("2", true)];
    // 2 completed + 1 bonus = 3
    expect(calculateTodayPoints(habits)).toBe(3);
  });

  test("allCompletedToday returns false when none done", () => {
    const habits = [makeHabit("1", false)];
    expect(allCompletedToday(habits)).toBe(false);
  });
});
