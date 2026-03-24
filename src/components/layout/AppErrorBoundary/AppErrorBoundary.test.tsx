import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AppErrorBoundary from "./AppErrorBoundary";

const ThrowingComponent = () => {
  throw new Error("Test error");
};

describe("AppErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
  });

  it("renders children normally", () => {
    renderWithProviders(
      <AppErrorBoundary>
        <div>Normal content</div>
      </AppErrorBoundary>,
    );
    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("shows fallback when a child throws an error", () => {
    renderWithProviders(
      <AppErrorBoundary>
        <ThrowingComponent />
      </AppErrorBoundary>,
    );
    expect(screen.getByText("Unexpected error occurred")).toBeInTheDocument();
  });
});
