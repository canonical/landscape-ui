import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InfoGrid from "./InfoGrid";
import classes from "./InfoGrid.module.scss";

describe("InfoGrid", () => {
  it("renders children", () => {
    renderWithProviders(<InfoGrid>Grid content</InfoGrid>);
    expect(screen.getByText("Grid content")).toBeInTheDocument();
  });

  it("renders InfoGrid.Item as a sub-component", () => {
    renderWithProviders(
      <InfoGrid>
        <InfoGrid.Item label="Hostname" value="my-host" />
      </InfoGrid>,
    );
    expect(screen.getByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("my-host")).toBeInTheDocument();
  });

  it("renders with spaced variant", () => {
    renderWithProviders(<InfoGrid spaced>content</InfoGrid>);
    expect(screen.getByText("content").parentElement).toHaveClass(
      classes.spacedInfoGrid,
    );
  });
});
