import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";

const SampleComponent = () => <Text>Hello, World!</Text>;

test("renders correctly", () => {
  const { getByText } = render(<SampleComponent />);
  expect(getByText("Hello, World!")).toBeTruthy();
});
