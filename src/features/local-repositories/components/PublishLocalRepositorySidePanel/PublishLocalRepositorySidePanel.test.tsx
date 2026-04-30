import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import PublishLocalRepositorySidePanel from "./PublishLocalRepositorySidePanel";
import { screen } from "@testing-library/react";

describe("PublishLocalRepositorySidePanel", () => {
  it("renders loading state when fetching repository", () => {
    renderWithProviders(<PublishLocalRepositorySidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders close button in side panel header", () => {
    renderWithProviders(<PublishLocalRepositorySidePanel />);

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});
