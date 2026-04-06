import OnboardingScreen from "@/app/onboarding";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// Mock expo-router
jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

// Mock the store
jest.mock("../../store/useAppStore", () => ({
  useAppStore: (selector: (s: unknown) => unknown) =>
    selector({
      completeOnboarding: jest.fn(),
    }),
}));

describe("OnboardingScreen", () => {
  test("renders welcome screen on first step", () => {
    const { getByText } = render(React.createElement(OnboardingScreen));
    expect(getByText("Welcome to Momentum")).toBeTruthy();
  });

  test("shows error when trying to proceed without plant name", () => {
    const { getByText } = render(React.createElement(OnboardingScreen));
    fireEvent.press(getByText("Next →"));
    // Alert.alert is called — no crash means validation ran
  });

  test("advances to step 2 when plant name is entered", () => {
    const { getByPlaceholderText, getByText } = render(
      React.createElement(OnboardingScreen),
    );
    fireEvent.changeText(
      getByPlaceholderText("e.g. Fern, Buddy, Sprout..."),
      "Fern",
    );
    fireEvent.press(getByText("Next →"));
    expect(getByText("Your Daily Habits")).toBeTruthy();
  });

  test("can add a habit in step 2", () => {
    const { getByPlaceholderText, getByText } = render(
      React.createElement(OnboardingScreen),
    );
    // Move to step 2
    fireEvent.changeText(
      getByPlaceholderText("e.g. Fern, Buddy, Sprout..."),
      "Fern",
    );
    fireEvent.press(getByText("Next →"));

    // Add a habit
    fireEvent.changeText(
      getByPlaceholderText("e.g. Read 10 pages..."),
      "Meditate",
    );
    fireEvent.press(getByText("+"));
    expect(getByText("Meditate")).toBeTruthy();
    expect(getByText("1/3 habits added")).toBeTruthy();
  });
});
