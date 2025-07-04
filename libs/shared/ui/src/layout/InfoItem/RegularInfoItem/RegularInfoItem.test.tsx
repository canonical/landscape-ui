import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import RegularInfoItem from "./RegularInfoItem";

const props = {
  label: "Label",
  value: "Value",
};

describe("RegularInfoItem", () => {
  it("should render", () => {
    renderWithProviders(<RegularInfoItem {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();
    expect(screen.getByText(props.value)).toBeInTheDocument();
  });
});
