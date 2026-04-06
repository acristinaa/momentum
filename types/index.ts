export interface Habit {
  id: string;
  title: string;
  createdAt: string; // ISO date string e.g. "2024-01-15"
  completedDates: string[]; // Array of ISO date strings when completed
}

export interface Plant {
  name: string;
  stage: 1 | 2 | 3;
  experience: number; // Total XP points accumulated
}

export interface AppData {
  habits: Habit[];
  plant: Plant;
  lastOpenedDate: string; // ISO date string,used to detect new days
  reminderEnabled: boolean;
  reminderTime: string; // "HH:MM" format e.g. "08:00"
  hasCompletedOnboarding: boolean;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type TabParamList = {
  Home: undefined;
  Habits: undefined;
  Progress: undefined;
  Settings: undefined;
};
