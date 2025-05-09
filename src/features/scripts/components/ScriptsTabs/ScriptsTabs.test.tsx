import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ScriptsTabs from "./ScriptsTabs";
import { TABS } from "./constants";

describe("Scripts Tabs", () => {
  const user = userEvent.setup();

  it("should switch between script tabs", async () => {
    renderWithProviders(<ScriptsTabs />);

    const scriptsTab = screen.getByRole("tab", {
      name: TABS[0].label,
    });

    expect(scriptsTab).toBeInTheDocument();
    expect(scriptsTab).toHaveAttribute("aria-selected", "true");

    const profilesTab = screen.getByRole("tab", {
      name: TABS[1].label,
    });
    expect(profilesTab).toBeInTheDocument();
    expect(profilesTab).toHaveAttribute("aria-selected", "false");

    await user.click(profilesTab);
    expect(profilesTab).toHaveAttribute("aria-selected", "true");
    expect(scriptsTab).toHaveAttribute("aria-selected", "false");
  });
});
