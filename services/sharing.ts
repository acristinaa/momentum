import { Share } from "react-native";
import { Habit, Plant } from "../types";
import { calculateStreak } from "../utils/dateUtils";
import { getStageName } from "../utils/plantUtils";

export async function shareProgress(
  plant: Plant,
  habits: Habit[],
): Promise<boolean> {
  const allCompletedDates = habits.flatMap((h) => h.completedDates);
  const streak = calculateStreak(allCompletedDates);
  const uniqueDays = new Set(allCompletedDates.map((d) => d.split("T")[0]))
    .size;

  const message =
    `🌱 My plant "${plant.name}" is a ${getStageName(plant.stage)} in Momentum!\n\n` +
    `🔥 ${streak} day streak\n` +
    `📅 ${uniqueDays} total active days\n` +
    `⭐ ${plant.experience} XP earned\n\n` +
    `Building habits, one day at a time 💪\n` +
    `#Momentum #HabitTracker`;

  try {
    const result = await Share.share({ message });
    return result.action !== Share.dismissedAction;
  } catch {
    return false;
  }
}
