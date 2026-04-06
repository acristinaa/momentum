import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

describe("smoke test", () => {
  it("renders text", () => {
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText("Hello")).toBeTruthy();
  });
});
