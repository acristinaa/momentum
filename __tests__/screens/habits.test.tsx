import { getTodayString } from "@/utils/dateUtils";
import { render } from "@testing-library/react-native";
import React from "react";
import HabitsScreen from "../../app/(tabs)/habits";
import { useAppStore } from "../../store/useAppStore";

const today = getTodayString();

beforeEach(async () => {
  useAppStore.getState().resetAll();
  useAppStore.getState().completeOnboarding("Fern", [{ title: "Read" }]);
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("hides add button when at max habits", async () => {
  await wait(1);
  useAppStore.getState().addHabit("Meditate");
  await wait(1);
  useAppStore.getState().addHabit("Exercise");
  const { queryByText } = render(<HabitsScreen />);
  expect(queryByText("Add Habit")).toBeNull();
});

test("shows max reached message at limit", async () => {
  await wait(1);
  useAppStore.getState().addHabit("Meditate");
  await wait(1);
  useAppStore.getState().addHabit("Exercise");
  const { getByText } = render(<HabitsScreen />);
  expect(getByText(/maximum of 3 habits/)).toBeTruthy();
});
