import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("renders Loading... text for screen readers", () => {
    renderWithProviders(<LoadingState />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders default p-strip status div", () => {
    renderWithProviders(<LoadingState />);
    const statusDiv = screen.getByRole("status");
    expect(statusDiv).toHaveClass("p-strip");
  });

  it("renders inline status div when inline prop is true", () => {
    renderWithProviders(<LoadingState inline />);
    const statusDiv = screen.getByRole("status");
    expect(statusDiv).not.toHaveClass("p-strip");
  });
});
