import { HabitFormModal } from "@/components/HabitFormModal";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("HabitFormModal", () => {
  test("renders add mode title", () => {
    const { getByText } = render(
      <HabitFormModal
        visible={true}
        mode="add"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(getByText("New Habit")).toBeTruthy();
  });

  test("renders edit mode title", () => {
    const { getByText } = render(
      <HabitFormModal
        visible={true}
        mode="edit"
        initialValue="Read"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(getByText("Edit Habit")).toBeTruthy();
  });

  test("calls onConfirm with trimmed input", () => {
    const onConfirm = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <HabitFormModal
        visible={true}
        mode="add"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );
    fireEvent.changeText(
      getByPlaceholderText("e.g. Read 10 pages, Drink water..."),
      "  Meditate  ",
    );
    fireEvent.press(getByText("Add Habit"));
    expect(onConfirm).toHaveBeenCalledWith("Meditate");
  });

  test("does not call onConfirm when input is empty", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <HabitFormModal
        visible={true}
        mode="add"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );
    fireEvent.press(getByText("Add Habit"));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test("calls onCancel when cancel is pressed", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <HabitFormModal
        visible={true}
        mode="add"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.press(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });
});
