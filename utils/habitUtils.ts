import { Habit } from "../types";
import { getTodayString } from "./dateUtils";

/*Checks if a habit has been completed today.*/
export function isCompletedToday(habit: Habit): boolean {
  const today = getTodayString();
  return habit.completedDates.includes(today);
}

/*Returns the number of habits completed today.*/
export function countCompletedToday(habits: Habit[]): number {
  return habits.filter(isCompletedToday).length;
}

/*Checks if ALL habits have been completed today.*/
export function allCompletedToday(habits: Habit[]): boolean {
  if (habits.length === 0) return false;
  return habits.every(isCompletedToday);
}

/*Calculates points earned today: +1 per completed habit, +1 bonus if ALL are done.*/
export function calculateTodayPoints(habits: Habit[]): number {
  const completed = countCompletedToday(habits);
  const bonus = allCompletedToday(habits) ? 1 : 0;
  return completed + bonus;
}
