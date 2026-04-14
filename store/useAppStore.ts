// src/store/useAppStore.ts
import { create } from "zustand";
import { clearAppData, saveAppData } from "../services/storage";
import { AppData, Habit, Plant } from "../types";
import { getTodayString } from "../utils/dateUtils";
import { calculateTodayPoints, isCompletedToday } from "../utils/habitUtils";
import { awardExperience } from "../utils/plantUtils";

interface AppStore extends AppData {
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

const defaultState: AppData = {
  habits: [],
  plant: { name: "", stage: 1, experience: 0 },
  lastOpenedDate: getTodayString(),
  reminderEnabled: false,
  reminderTime: "08:00",
  hasCompletedOnboarding: false,
};

function extractAppData(state: AppStore): AppData {
  return {
    habits: state.habits,
    plant: state.plant,
    lastOpenedDate: state.lastOpenedDate,
    reminderEnabled: state.reminderEnabled,
    reminderTime: state.reminderTime,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
  };
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...defaultState,

  completeOnboarding: (plantName, habitInputs) => {
    const today = getTodayString();
    const habits: Habit[] = habitInputs.map((h, i) => ({
      id: `habit_${Date.now()}_${i}`,
      title: h.title,
      createdAt: today,
      completedDates: [],
    }));

    const next: Partial<AppData> = {
      plant: { name: plantName, stage: 1, experience: 0 },
      habits,
      hasCompletedOnboarding: true,
      lastOpenedDate: today,
    };

    set(next);
    saveAppData(extractAppData({ ...get(), ...next }));
  },

  addHabit: (title) => {
    const { habits } = get();
    if (habits.length >= 3) return;

    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      title,
      createdAt: getTodayString(),
      completedDates: [],
    };

    const next = { habits: [...habits, newHabit] };
    set(next);
    saveAppData(extractAppData({ ...get(), ...next }));
  },

  editHabit: (id, title) => {
    set((state) => {
      const next = {
        habits: state.habits.map((h) => (h.id === id ? { ...h, title } : h)),
      };
      saveAppData(extractAppData({ ...state, ...next }));
      return next;
    });
  },

  deleteHabit: (id) => {
    set((state) => {
      const next = {
        habits: state.habits.filter((h) => h.id !== id),
      };
      saveAppData(extractAppData({ ...state, ...next }));
      return next;
    });
  },

  toggleHabitCompletion: (id) => {
    const { habits, plant } = get();
    const today = getTodayString();

    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    const alreadyDone = isCompletedToday(habit);

    const updatedHabits = habits.map((h) => {
      if (h.id !== id) return h;
      return {
        ...h,
        completedDates: alreadyDone
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today],
      };
    });

    const pointsBefore = calculateTodayPoints(habits);
    const pointsAfter = calculateTodayPoints(updatedHabits);
    const pointsDelta = pointsAfter - pointsBefore;

    const updatedPlant =
      pointsDelta > 0 ? awardExperience(plant, pointsDelta) : plant;

    const next = { habits: updatedHabits, plant: updatedPlant };
    set(next);
    saveAppData(extractAppData({ ...get(), ...next }));
  },

  updatePlant: (plant) => {
    set({ plant });
    saveAppData(extractAppData({ ...get(), plant }));
  },

  setReminderEnabled: (enabled) => {
    set({ reminderEnabled: enabled });
    saveAppData(extractAppData({ ...get(), reminderEnabled: enabled }));
  },

  setReminderTime: (time) => {
    set({ reminderTime: time });
    saveAppData(extractAppData({ ...get(), reminderTime: time }));
  },

  loadFromStorage: (data) => {
    set({ ...data });
  },

  resetAll: () => {
    set({ ...defaultState });
    // wipe AsyncStorage so next launch starts fresh
    clearAppData();
  },

  handleAppForeground: () => {
    const today = getTodayString();
    const current = get();
    if (current.lastOpenedDate !== today) {
      const next = { lastOpenedDate: today };
      set(next);
      saveAppData(extractAppData({ ...current, ...next }));
    }
  },
}));
