export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/*Checks if two ISO date strings represent the same calendar day.*/
export function isSameDay(dateA: string, dateB: string): boolean {
  return dateA.split("T")[0] === dateB.split("T")[0];
}

/**
 * Calculates the current streak: how many consecutive days
 * (going backwards from today) had at least one completion.
 *
 * @param completedDays - Array of ISO date strings with completions
 */
export function calculateStreak(completedDays: string[]): number {
  if (completedDays.length === 0) return 0;

  // Remove duplicates and sort descending (most recent first)
  const uniqueDays = [
    ...new Set(completedDays.map((d) => d.split("T")[0])),
  ].sort((a, b) => (a > b ? -1 : 1));

  const today = getTodayString();
  let streak = 0;
  let current = today;

  for (const day of uniqueDays) {
    if (day === current) {
      streak++;
      // Move to the previous day
      const prev = new Date(current);
      prev.setDate(prev.getDate() - 1);
      current = prev.toISOString().split("T")[0];
    } else {
      break; // Gap found, sostreak ends
    }
  }

  return streak;
}
