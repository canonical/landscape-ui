import { scriptDetails } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import ScriptDetailsTabs from "./ScriptDetailsTabs";

const props: ComponentProps<typeof ScriptDetailsTabs> = {
  script: scriptDetails,
  viewVersionHistory: vi.fn(),
};

const expectCurrent = (name: string) => {
  for (const link of screen.getAllByRole("link")) {
    if (link.textContent === name) {
      expect(link).toHaveAttribute("aria-current", "page");
    } else {
      expect(link).not.toHaveAttribute("aria-current");
    }
  }
};

describe("Script Details Tabs", () => {
  const user = userEvent.setup();

  it("should switch between script details tabs", async () => {
    renderWithProviders(
      <ScriptDetailsTabs {...props} />,
      undefined,
      "/scripts?tab=scripts",
    );

    expect(
      screen.getByRole("navigation", { name: "Script details" }),
    ).toBeInTheDocument();
    expectCurrent("Info");

    const codeTab = screen.getByRole("link", { name: "Code" });
    expect(decodeURIComponent(codeTab.getAttribute("href") ?? "")).toBe(
      "/scripts?tab=scripts&tab=panel:code",
    );

    await user.click(codeTab);
    await waitFor(() => {
      expectCurrent("Code");
    });

    await user.click(screen.getByRole("link", { name: "Version history" }));
    await waitFor(() => {
      expectCurrent("Version history");
    });

    expect(screen.getByRole("link", { name: "Info" })).toHaveAttribute(
      "href",
      "/scripts?tab=scripts",
    );
  });

  it("should open the tab from the panel tab slot", () => {
    renderWithProviders(
      <ScriptDetailsTabs {...props} />,
      undefined,
      "/scripts?tab=panel:code",
    );

    expectCurrent("Code");
  });
});
