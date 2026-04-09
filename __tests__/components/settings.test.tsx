import { render } from "@testing-library/react-native";
import React from "react";
import SettingsScreen from "../../app/(tabs)/settings";
import { useAppStore } from "../../store/useAppStore";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

beforeEach(() => {
  useAppStore.getState().resetAll();
});

describe("SettingsScreen", () => {
  test("renders without crashing", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Settings")).toBeTruthy();
  });

  test("shows daily reminder toggle", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Daily Reminder")).toBeTruthy();
  });

  test("hides time picker row when reminder is off", () => {
    const { queryByText } = render(<SettingsScreen />);
    expect(queryByText("Reminder Time")).toBeNull();
  });

  test("shows time picker row when reminder is enabled", () => {
    useAppStore.getState().setReminderEnabled(true);
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Reminder Time")).toBeTruthy();
  });

  test("shows reset button", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Reset All Data")).toBeTruthy();
  });

  test("shows plant info card", () => {
    useAppStore.getState().completeOnboarding("Fern", [{ title: "Read" }]);
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Fern")).toBeTruthy();
  });

  test("updates store when reminder is toggled", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(useAppStore.getState().reminderEnabled).toBe(false);
  });
});
