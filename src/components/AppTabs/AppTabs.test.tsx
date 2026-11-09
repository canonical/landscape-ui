import { Badge } from "@canonical/react-ds-global";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import AppTabs from "./AppTabs";
import { getActiveTabId } from "./helpers";
import type { AppTabItem } from "./types";

const closeSidePanel = vi.fn();

vi.mock("@/hooks/useSidePanel", () => ({
  default: () => ({ closeSidePanel }),
}));

const pageItems: AppTabItem[] = [
  { id: "scripts", label: "Scripts", panel: <p>Scripts panel</p> },
  { id: "profiles", label: "Profiles", panel: <p>Profiles panel</p> },
];

const panelItems: AppTabItem[] = [
  { id: "info", label: "Info", panel: <p>Info panel</p> },
  { id: "code", label: "Code", panel: <p>Code panel</p> },
  { id: "history", label: "History", panel: <p>History panel</p> },
];

const renderAtUrl = (url: string, element: ReactNode) => {
  const router = createMemoryRouter([{ path: "/scripts", element }], {
    initialEntries: ["/start", url],
    initialIndex: 1,
  });

  render(<RouterProvider router={router} />);

  return router;
};

const getNav = (name: string) => screen.getByRole("navigation", { name });

const getTab = (nav: string, name: string | RegExp) =>
  within(getNav(nav)).getByRole("link", { name });

const getSearch = (router: ReturnType<typeof renderAtUrl>) =>
  decodeURIComponent(router.state.location.search);

describe("getActiveTabId", () => {
  it("resolves the URL value, then the default, then the first item", () => {
    expect(getActiveTabId({ items: panelItems, value: "code" })).toBe("code");
    expect(getActiveTabId({ items: panelItems, value: "bogus" })).toBe("info");
    expect(
      getActiveTabId({ items: panelItems, value: "bogus", defaultId: "code" }),
    ).toBe("code");
    expect(getActiveTabId({ items: panelItems, value: undefined })).toBe(
      "info",
    );
    expect(getActiveTabId({ items: [], value: "code" })).toBeUndefined();
  });

  it("never resolves a disabled tab", () => {
    const items: AppTabItem[] = [
      { id: "info", label: "Info", disabled: true },
      { id: "code", label: "Code" },
    ];

    expect(getActiveTabId({ items, value: "info", defaultId: "info" })).toBe(
      "code",
    );
  });
});

describe("AppTabs", () => {
  describe("page strip", () => {
    it("renders a labelled navigation of links to the page's tab URLs", () => {
      renderAtUrl("/scripts", <AppTabs aria-label="Scripts" items={pageItems} />);

      expect(getNav("Scripts")).toBeInTheDocument();
      expect(screen.queryByRole("tab")).not.toBeInTheDocument();
      expect(getTab("Scripts", "Scripts")).toHaveAttribute(
        "href",
        "/scripts?tab=scripts",
      );
      expect(getTab("Scripts", "Profiles")).toHaveAttribute(
        "href",
        "/scripts?tab=profiles",
      );
    });

    it("marks the default tab current when the URL has no tab", () => {
      renderAtUrl("/scripts", <AppTabs aria-label="Scripts" items={pageItems} />);

      expect(getTab("Scripts", "Scripts")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getTab("Scripts", "Profiles")).not.toHaveAttribute("aria-current");
      expect(screen.getByText("Scripts panel")).toBeInTheDocument();
    });

    it("honours defaultId", () => {
      renderAtUrl(
        "/scripts",
        <AppTabs aria-label="Scripts" items={pageItems} defaultId="profiles" />,
      );

      expect(getTab("Scripts", "Profiles")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText("Profiles panel")).toBeInTheDocument();
    });

    it("opens the tab named by a direct link", () => {
      renderAtUrl(
        "/scripts?tab=profiles",
        <AppTabs aria-label="Scripts" items={pageItems} />,
      );

      expect(getTab("Scripts", "Profiles")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText("Profiles panel")).toBeInTheDocument();
      expect(screen.queryByText("Scripts panel")).not.toBeInTheDocument();
    });

    it("falls back to the default tab for an unknown value", () => {
      renderAtUrl(
        "/scripts?tab=bogus",
        <AppTabs aria-label="Scripts" items={pageItems} />,
      );

      expect(getTab("Scripts", "Scripts")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText("Scripts panel")).toBeInTheDocument();
    });

    it("switches tabs by replacing the URL with only the new tab", async () => {
      closeSidePanel.mockClear();
      const router = renderAtUrl(
        "/scripts?tab=scripts&search=foo&sidePath=view&name=1&tab=panel:code",
        <AppTabs aria-label="Scripts" items={pageItems} />,
      );

      await userEvent.click(getTab("Scripts", "Profiles"));

      expect(router.state.location.pathname).toBe("/scripts");
      expect(getSearch(router)).toBe("?tab=profiles");
      expect(router.state.historyAction).toBe("REPLACE");
      expect(getTab("Scripts", "Profiles")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText("Profiles panel")).toBeInTheDocument();
      expect(closeSidePanel).toHaveBeenCalledTimes(1);
    });

    it("keeps the previous page in history when switching tabs", async () => {
      const router = renderAtUrl(
        "/scripts",
        <AppTabs aria-label="Scripts" items={pageItems} />,
      );

      await userEvent.click(getTab("Scripts", "Profiles"));
      await router.navigate(-1);

      expect(router.state.location.pathname).toBe("/start");

      await router.navigate(1);

      expect(getSearch(router)).toBe("?tab=profiles");
      expect(await screen.findByText("Profiles panel")).toBeInTheDocument();
    });
  });

  describe("slot strip", () => {
    it("links to the current URL with only its slot changed", () => {
      renderAtUrl(
        "/scripts?tab=scripts&search=foo&tab=panel:history",
        <AppTabs aria-label="Script details" slot="panel" items={panelItems} />,
      );

      const codeHref = getTab("Script details", "Code").getAttribute("href");

      expect(decodeURIComponent(codeHref ?? "")).toBe(
        "/scripts?tab=scripts&tab=panel:code&search=foo",
      );
      expect(getTab("Script details", "History")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("omits its slot from the default tab's link", () => {
      renderAtUrl(
        "/scripts?tab=panel:code",
        <AppTabs aria-label="Script details" slot="panel" items={panelItems} />,
      );

      expect(getTab("Script details", "Info")).toHaveAttribute(
        "href",
        "/scripts",
      );
    });

    it("falls back to the default tab for an unknown slot value", () => {
      renderAtUrl(
        "/scripts?tab=panel:bogus",
        <AppTabs aria-label="Script details" slot="panel" items={panelItems} />,
      );

      expect(getTab("Script details", "Info")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByText("Info panel")).toBeInTheDocument();
    });

    it("does not close the side panel when switching", async () => {
      closeSidePanel.mockClear();
      const router = renderAtUrl(
        "/scripts?sidePath=view&name=1",
        <AppTabs aria-label="Script details" slot="panel" items={panelItems} />,
      );

      await userEvent.click(getTab("Script details", "Code"));

      expect(getSearch(router)).toBe("?tab=panel:code&sidePath=view&name=1");
      expect(router.state.historyAction).toBe("REPLACE");
      expect(screen.getByText("Code panel")).toBeInTheDocument();
      expect(closeSidePanel).not.toHaveBeenCalled();
    });
  });

  describe("page and slot strips together", () => {
    const renderBoth = (url: string) =>
      renderAtUrl(
        url,
        <>
          <AppTabs aria-label="Scripts" items={pageItems} />
          <AppTabs aria-label="Script details" slot="panel" items={panelItems} />
          <AppTabs
            aria-label="Upgrades"
            slot="upgrades"
            items={[
              { id: "instances", label: "Instances" },
              { id: "packages", label: "Packages" },
            ]}
          />
        </>,
      );

    it("restores every strip from one URL", () => {
      renderBoth(
        "/scripts?tab=profiles&tab=upgrades:packages&tab=panel:history",
      );

      expect(getTab("Scripts", "Profiles")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getTab("Script details", "History")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getTab("Upgrades", "Packages")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("keeps the other strips when switching a slot", async () => {
      const router = renderBoth("/scripts?tab=profiles&tab=upgrades:packages");

      await userEvent.click(getTab("Script details", "Code"));

      expect(getSearch(router)).toBe(
        "?tab=profiles&tab=panel:code&tab=upgrades:packages",
      );
      expect(getTab("Scripts", "Profiles")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getTab("Upgrades", "Packages")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("resets every slot when switching the page tab", async () => {
      const router = renderBoth(
        "/scripts?tab=profiles&tab=upgrades:packages&tab=panel:code",
      );

      await userEvent.click(getTab("Scripts", "Scripts"));

      expect(getSearch(router)).toBe("?tab=scripts");
      expect(getTab("Script details", "Info")).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(getTab("Upgrades", "Instances")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });

  it("renders rich label content inside the tab link", () => {
    renderAtUrl(
      "/scripts",
      <AppTabs
        aria-label="Administrators"
        items={[
          { id: "administrators", label: "Administrators" },
          {
            id: "invites",
            label: "Invites",
            labelContent: (
              <>
                <span>Invites</span>
                <Badge value={3} />
              </>
            ),
          },
        ]}
      />,
    );

    const invites = getTab("Administrators", /^Invites/);

    expect(invites).toHaveAttribute("href", "/scripts?tab=invites");
    expect(within(invites).getByText("3")).toBeInTheDocument();
  });

  it("renders a disabled tab as a disabled link without a destination", () => {
    renderAtUrl(
      "/scripts?tab=code",
      <AppTabs
        aria-label="Script details"
        items={[
          { id: "info", label: "Info" },
          { id: "code", label: "Code", disabled: true },
        ]}
      />,
    );

    const code = getTab("Script details", "Code");

    expect(code).not.toHaveAttribute("href");
    expect(code).toHaveAttribute("aria-disabled", "true");
    expect(getTab("Script details", "Info")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders only the panel when there is a single tab", () => {
    renderAtUrl(
      "/scripts",
      <AppTabs aria-label="Script details" items={panelItems.slice(0, 1)} />,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.getByText("Info panel")).toBeInTheDocument();
  });
});
