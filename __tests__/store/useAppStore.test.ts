import { useAppStore } from "../../store/useAppStore";

beforeEach(() => {
  useAppStore.getState().resetAll();
});

describe("useAppStore", () => {
  test("starts with no habits and no onboarding", () => {
    const { habits, hasCompletedOnboarding } = useAppStore.getState();
    expect(habits).toHaveLength(0);
    expect(hasCompletedOnboarding).toBe(false);
  });

  test("completeOnboarding sets plant name and habits", () => {
    useAppStore.getState().completeOnboarding("Fern", [{ title: "Read" }]);
    const { plant, habits, hasCompletedOnboarding } = useAppStore.getState();
    expect(plant.name).toBe("Fern");
    expect(habits).toHaveLength(1);
    expect(hasCompletedOnboarding).toBe(true);
  });

  test("addHabit enforces max 3 habits", () => {
    const { addHabit } = useAppStore.getState();
    addHabit("Habit 1");
    addHabit("Habit 2");
    addHabit("Habit 3");
    addHabit("Habit 4"); // should be ignored
    expect(useAppStore.getState().habits).toHaveLength(3);
  });

  test("toggleHabitCompletion awards XP", () => {
    useAppStore.getState().completeOnboarding("Fern", [{ title: "Read" }]);
    const { habits } = useAppStore.getState();
    useAppStore.getState().toggleHabitCompletion(habits[0].id);
    expect(useAppStore.getState().plant.experience).toBeGreaterThan(0);
  });
});
