import { create } from "zustand";
import { AppData, Habit, Plant } from "../types";
import { getTodayString } from "../utils/dateUtils";
import { calculateTodayPoints, isCompletedToday } from "../utils/habitUtils";
import { awardExperience } from "../utils/plantUtils";

interface AppStore extends AppData {
  // Onboarding
  completeOnboarding: (
    plantName: string,
    habits: Omit<Habit, "id" | "createdAt" | "completedDates">[],
  ) => void;

  // Habits
  addHabit: (title: string) => void;
  editHabit: (id: string, title: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;

  // Plant
  updatePlant: (plant: Plant) => void;

  // Settings
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;

  // Persistence
  loadFromStorage: (data: AppData) => void;
  resetAll: () => void;

  // Lifecycle
  handleAppForeground: () => void;
}

// Default state for a brand new user
const defaultState: AppData = {
  habits: [],
  plant: { name: "", stage: 1, experience: 0 },
  lastOpenedDate: getTodayString(),
  reminderEnabled: false,
  reminderTime: "08:00",
  hasCompletedOnboarding: false,
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...defaultState,

  // Onboarding
  completeOnboarding: (plantName, habitInputs) => {
    const today = getTodayString();
    const habits: Habit[] = habitInputs.map((h, i) => ({
      id: `habit_${Date.now()}_${i}`,
      title: h.title,
      createdAt: today,
      completedDates: [],
    }));

    set({
      plant: { name: plantName, stage: 1, experience: 0 },
      habits,
      hasCompletedOnboarding: true,
      lastOpenedDate: today,
    });
  },

  // Habits
  addHabit: (title) => {
    const { habits } = get();
    // Max 3 habits enforced here
    if (habits.length >= 3) return;

    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      title,
      createdAt: getTodayString(),
      completedDates: [],
    };

    set({ habits: [...habits, newHabit] });
  },

  editHabit: (id, title) => {
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, title } : h)),
    }));
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    }));
  },

  toggleHabitCompletion: (id) => {
    const { habits, plant } = get();
    const today = getTodayString();

    // Was this habit already done today?
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    const alreadyDone = isCompletedToday(habit);

    // Update the habit's completedDates
    const updatedHabits = habits.map((h) => {
      if (h.id !== id) return h;
      return {
        ...h,
        completedDates: alreadyDone
          ? h.completedDates.filter((d) => d !== today) // un-complete
          : [...h.completedDates, today], // complete
      };
    });

    // Recalculate points only when completing (not un-completing)
    // We track XP cumulatively — only award new points
    const pointsBefore = calculateTodayPoints(habits);
    const pointsAfter = calculateTodayPoints(updatedHabits);
    const pointsDelta = pointsAfter - pointsBefore;

    const updatedPlant =
      pointsDelta > 0 ? awardExperience(plant, pointsDelta) : plant;

    set({ habits: updatedHabits, plant: updatedPlant });
  },

  // Plant
  updatePlant: (plant) => set({ plant }),

  // Settings
  setReminderEnabled: (enabled) => set({ reminderEnabled: enabled }),
  setReminderTime: (time) => set({ reminderTime: time }),

  // Persistence
  // Called once on app start to hydrate state from AsyncStorage
  loadFromStorage: (data) => set({ ...data }),

  resetAll: () => set({ ...defaultState }),

  // Lifecycle
  handleAppForeground: () => {
    const today = getTodayString();
    set({ lastOpenedDate: today });
    // Daily reset logic lives in useDailyReset hook
  },
}));
