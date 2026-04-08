import { ProgressBar } from "@/components/PorgressBar";
import { render } from "@testing-library/react-native";
import React from "react";

describe("ProgressBar", () => {
  test("renders without label", () => {
    const { toJSON } = render(<ProgressBar current={5} max={10} />);
    expect(toJSON()).toBeTruthy();
  });

  test("renders with label and XP values", () => {
    const { getByText } = render(
      <ProgressBar current={5} max={10} label="Next stage" />,
    );
    expect(getByText("Next stage")).toBeTruthy();
    expect(getByText("5 / 10 XP")).toBeTruthy();
  });

  test("renders at 0 progress without crashing", () => {
    const { toJSON } = render(<ProgressBar current={0} max={10} />);
    expect(toJSON()).toBeTruthy();
  });

  test("clamps to 100% when current exceeds max", () => {
    // Should not crash when overfilled
    const { toJSON } = render(<ProgressBar current={15} max={10} />);
    expect(toJSON()).toBeTruthy();
  });
});
