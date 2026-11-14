import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ScriptsTabs from "./ScriptsTabs";

describe("Scripts Tabs", () => {
  const user = userEvent.setup();

  it("should switch between script tabs", async () => {
    renderWithProviders(<ScriptsTabs />, undefined, "/scripts");

    const nav = screen.getByRole("navigation", { name: "Scripts" });
    expect(nav).toBeInTheDocument();

    const scriptsTab = screen.getByRole("link", { name: "Scripts" });
    const profilesTab = screen.getByRole("link", { name: "Profiles" });

    expect(scriptsTab).toHaveAttribute("aria-current", "page");
    expect(profilesTab).not.toHaveAttribute("aria-current");
    expect(profilesTab).toHaveAttribute("href", "/scripts?tab=profiles");

    await user.click(profilesTab);

    expect(screen.getByRole("link", { name: "Profiles" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Scripts" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("should open the tab from a direct link", () => {
    renderWithProviders(<ScriptsTabs />, undefined, "/scripts?tab=profiles");

    expect(screen.getByRole("link", { name: "Profiles" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
