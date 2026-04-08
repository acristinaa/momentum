import { StreakBadge } from "@/components/StreakBadge";
import { render } from "@testing-library/react-native";
import React from "react";

describe("StreakBadge", () => {
  test("renders streak number", () => {
    const { getByText } = render(<StreakBadge streak={5} />);
    expect(getByText("5")).toBeTruthy();
  });

  test("shows start message when streak is 0", () => {
    const { getByText } = render(<StreakBadge streak={0} />);
    expect(getByText("Start your streak today!")).toBeTruthy();
  });

  test("shows fire emoji", () => {
    const { getByText } = render(<StreakBadge streak={3} />);
    expect(getByText("🔥")).toBeTruthy();
  });
});
