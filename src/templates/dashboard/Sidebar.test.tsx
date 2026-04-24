import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  const user = userEvent.setup();

  it("renders the navigation", () => {
    renderWithProviders(<Sidebar />);
    // The sidebar contains navigation elements
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the toggle menu button on mobile", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
  });

  it("toggles sidebar open when clicking the mobile menu toggle button", async () => {
    renderWithProviders(<Sidebar />);

    const toggleBtn = screen.getByRole("button", { name: /menu/i });
    await user.click(toggleBtn);

    // After click, sidebar should be in expanded state
    const header = document.querySelector(".l-navigation");
    expect(header).not.toHaveClass("is-collapsed");
  });

  it("collapses navigation when close button is clicked after opening", async () => {
    renderWithProviders(<Sidebar />);

    // Open the menu first
    const toggleBtn = screen.getByRole("button", { name: /menu/i });
    await user.click(toggleBtn);

    const header = document.querySelector(".l-navigation");
    expect(header).not.toHaveClass("is-collapsed");

    // Close via the DesktopHeader close button
    const closeBtn = screen.getByRole("button", { name: /close navigation/i });
    await user.click(closeBtn);

    expect(header).toHaveClass("is-collapsed");
  });
});
