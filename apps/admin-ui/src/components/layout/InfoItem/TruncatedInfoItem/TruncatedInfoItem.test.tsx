import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import TruncatedInfoItem from "./TruncatedInfoItem";

const props = {
  label: "Label",
  value: "Value",
};

describe("TruncatedInfoItem", () => {
  it("should render", () => {
    renderWithProviders(<TruncatedInfoItem {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();
    expect(screen.getByText(props.value)).toBeInTheDocument();
  });
});
