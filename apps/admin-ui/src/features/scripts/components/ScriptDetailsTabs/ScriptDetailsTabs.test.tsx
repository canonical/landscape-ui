import { scriptDetails } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { SCRIPT_TABS } from "./constants";
import ScriptDetailsTabs from "./ScriptDetailsTabs";

const props: ComponentProps<typeof ScriptDetailsTabs> = {
  script: scriptDetails,
  viewVersionHistory: vi.fn(),
  initialTabId: SCRIPT_TABS[0].id,
};

describe("Script Details Tabs", () => {
  const user = userEvent.setup();

  it("should switch between script details tabs", async () => {
    renderWithProviders(<ScriptDetailsTabs {...props} />);

    const scriptsTab = screen.getByRole("tab", {
      name: SCRIPT_TABS[0].label,
    });

    expect(scriptsTab).toBeInTheDocument();
    expect(scriptsTab).toHaveAttribute("aria-selected", "true");

    const codeTab = screen.getByRole("tab", {
      name: SCRIPT_TABS[1].label,
    });
    expect(codeTab).toBeInTheDocument();
    expect(codeTab).toHaveAttribute("aria-selected", "false");

    await user.click(codeTab);

    expect(codeTab).toHaveAttribute("aria-selected", "true");
    expect(scriptsTab).toHaveAttribute("aria-selected", "false");

    const versionHistoryTab = screen.getByRole("tab", {
      name: SCRIPT_TABS[2].label,
    });
    expect(versionHistoryTab).toBeInTheDocument();
    expect(versionHistoryTab).toHaveAttribute("aria-selected", "false");

    await user.click(versionHistoryTab);

    expect(versionHistoryTab).toHaveAttribute("aria-selected", "true");
    expect(codeTab).toHaveAttribute("aria-selected", "false");
    expect(scriptsTab).toHaveAttribute("aria-selected", "false");
  });
});
