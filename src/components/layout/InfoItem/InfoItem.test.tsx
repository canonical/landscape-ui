import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import InfoItem from "./InfoItem";

const props = {
  label: "Label",
  value: "Value",
};

describe("InfoItem", () => {
  it("should render a regular info item", () => {
    renderWithProviders(<InfoItem {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();
    expect(screen.getByText(props.value)).toBeInTheDocument();
  });

  it("should render a password info item", () => {
    renderWithProviders(<InfoItem type="password" {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();
    expect(screen.getByText("****************")).toBeInTheDocument();
  });

  it("should render a truncated info item", () => {
    renderWithProviders(<InfoItem type="truncated" {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();
    expect(screen.getByText(props.value)).toBeInTheDocument();
  });
});
