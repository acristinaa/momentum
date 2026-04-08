import { getTodayString } from "@/utils/dateUtils";
import { render } from "@testing-library/react-native";
import React from "react";
import HabitsScreen from "../../app/(tabs)/habits";
import { useAppStore } from "../../store/useAppStore";

const today = getTodayString();

beforeEach(() => {
  useAppStore.getState().resetAll();
  useAppStore.getState().completeOnboarding("Fern", [{ title: "Read" }]);
});

describe("HabitsScreen", () => {
  test("renders existing habits", () => {
    const { getByText } = render(<HabitsScreen />);
    expect(getByText("Read")).toBeTruthy();
  });

  test("shows add button when under limit", () => {
    const { getByText } = render(<HabitsScreen />);
    expect(getByText("Add Habit")).toBeTruthy();
  });

  test("hides add button when at max habits", () => {
    useAppStore.getState().addHabit("Meditate");
    useAppStore.getState().addHabit("Exercise");
    const { queryByText } = render(<HabitsScreen />);
    expect(queryByText("Add Habit")).toBeNull();
  });

  test("shows max reached message at limit", () => {
    useAppStore.getState().addHabit("Meditate");
    useAppStore.getState().addHabit("Exercise");
    const { getByText } = render(<HabitsScreen />);
    expect(getByText(/maximum of 3 habits/)).toBeTruthy();
  });
});
