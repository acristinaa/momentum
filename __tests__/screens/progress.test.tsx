import { render } from "@testing-library/react-native";
import React from "react";
import ProgressScreen from "../../app/(tabs)/progress";
import { useAppStore } from "../../store/useAppStore";

beforeEach(() => {
  useAppStore.getState().resetAll();
});

describe("ProgressScreen", () => {
  test("renders with no data without crashing", () => {
    const { getByText } = render(<ProgressScreen />);
    expect(getByText("Progress")).toBeTruthy();
  });

  test("shows zero stats on fresh start", () => {
    const { getAllByText } = render(<ProgressScreen />);
    // All 3 stat cards (streak, days active, XP) show 0 on fresh start
    const zeros = getAllByText("0");
    expect(zeros.length).toBe(3);
  });

  test("shows plant name after onboarding", () => {
    useAppStore.getState().completeOnboarding("Fern", [{ title: "Read" }]);
    const { getByText } = render(<ProgressScreen />);
    expect(getByText("Fern")).toBeTruthy();
  });

  test("shows share button", () => {
    const { getByText } = render(<ProgressScreen />);
    expect(getByText("Share My Progress")).toBeTruthy();
  });

  test("shows motivational footer", () => {
    const { getByText } = render(<ProgressScreen />);
    expect(
      getByText("Every journey starts with a single step 🌱"),
    ).toBeTruthy();
  });
});
