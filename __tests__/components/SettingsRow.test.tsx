import { SettingsRow } from "@/components/SettingsRow";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("SettingsRow", () => {
  test("renders label correctly", () => {
    const { getByText } = render(
      <SettingsRow
        icon="🔔"
        label="Daily Reminder"
        variant="toggle"
        value={false}
        onToggle={jest.fn()}
      />,
    );
    expect(getByText("Daily Reminder")).toBeTruthy();
  });

  test("renders description when provided", () => {
    const { getByText } = render(
      <SettingsRow
        icon="🔔"
        label="Daily Reminder"
        description="A helpful nudge"
        variant="toggle"
        value={false}
        onToggle={jest.fn()}
      />,
    );
    expect(getByText("A helpful nudge")).toBeTruthy();
  });

  test("calls onPress for arrow variant", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <SettingsRow
        icon="⏰"
        label="Reminder Time"
        variant="arrow"
        onPress={onPress}
      />,
    );
    fireEvent.press(getByText("Reminder Time"));
    expect(onPress).toHaveBeenCalled();
  });

  test("renders rightLabel for arrow variant", () => {
    const { getByText } = render(
      <SettingsRow
        icon="⏰"
        label="Reminder Time"
        variant="arrow"
        rightLabel="8:00 AM"
        onPress={jest.fn()}
      />,
    );
    expect(getByText("8:00 AM")).toBeTruthy();
  });

  test("calls onPress for destructive variant", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <SettingsRow
        icon="🗑️"
        label="Reset All Data"
        variant="destructive"
        onPress={onPress}
      />,
    );
    fireEvent.press(getByText("Reset All Data"));
    expect(onPress).toHaveBeenCalled();
  });
});
