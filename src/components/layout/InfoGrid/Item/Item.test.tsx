import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Item from "./Item";
import classes from "./Item.module.scss";

describe("InfoGrid/Item", () => {
  it("renders an InfoItem with label and value", () => {
    renderWithProviders(<Item label="My label" value="My value" />);
    expect(screen.getByText("My label")).toBeInTheDocument();
    expect(screen.getByText("My value")).toBeInTheDocument();
  });

  it("renders with large class when large prop is true", () => {
    renderWithProviders(<Item label="Label" value="Value" large />);
    expect(screen.getByText("Label").parentElement).toHaveClass(
      classes.largeItem,
    );
  });

  it("renders without large class by default", () => {
    renderWithProviders(<Item label="Label" value="Value" />);
    expect(screen.getByText("Label").parentElement).not.toHaveClass(
      classes.largeItem,
    );
  });
});
