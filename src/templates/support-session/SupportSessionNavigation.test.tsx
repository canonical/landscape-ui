import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SupportSessionNavigation from "./SupportSessionNavigation";
import type { SupportSessionNavItem } from "./types";

const ITEMS: SupportSessionNavItem[] = [
  { label: "Events log", icon: "status", path: "/session/events-log" },
  {
    label: "Profiles",
    icon: "cluster",
    items: [
      { label: "Package profiles", path: "/session/profiles/package" },
      { label: "Reboot profiles", path: "/session/profiles/reboot" },
    ],
  },
  {
    label: "Org. settings",
    icon: "settings",
    items: [
      { label: "General", path: "/session/settings/general" },
      { label: "Administrators", path: "/session/settings/administrators" },
    ],
  },
  { label: "Activities", icon: "switcher-environments" },
];

const renderNavigation = (path: string) =>
  renderWithProviders(
    <SupportSessionNavigation items={ITEMS} />,
    undefined,
    path,
  );

const getGroup = (label: string) => screen.getByRole("button", { name: label });

describe("SupportSessionNavigation", () => {
  const user = userEvent.setup();

  it("marks a page outside any group as current and leaves every group collapsed", () => {
    renderNavigation("/session/events-log");

    expect(screen.getByRole("link", { name: "Events log" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getGroup("Profiles")).toHaveAttribute("aria-expanded", "false");
    expect(getGroup("Org. settings")).toHaveAttribute("aria-expanded", "false");
  });

  it("expands the group of the current page and marks the page", () => {
    renderNavigation("/session/settings/administrators");

    expect(getGroup("Org. settings")).toHaveAttribute("aria-expanded", "true");
    expect(getGroup("Profiles")).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("link", { name: "Administrators" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "General" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("expands the group of a page below one of its pages", () => {
    renderNavigation("/session/profiles/reboot/some-profile");

    expect(getGroup("Profiles")).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps one group expanded at a time", async () => {
    renderNavigation("/session/profiles/package");

    await user.click(getGroup("Org. settings"));

    expect(getGroup("Org. settings")).toHaveAttribute("aria-expanded", "true");
    expect(getGroup("Profiles")).toHaveAttribute("aria-expanded", "false");
  });

  it("moves the expanded group along with the current page", async () => {
    renderNavigation("/session/profiles/package");

    await user.click(screen.getByRole("link", { name: "Administrators" }));

    expect(getGroup("Org. settings")).toHaveAttribute("aria-expanded", "true");
    expect(getGroup("Profiles")).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("link", { name: "Administrators" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("shows an entry without a page as a disabled placeholder", () => {
    renderNavigation("/session/events-log");

    const placeholder = screen.getByText("Activities").parentElement;

    expect(placeholder).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.queryByRole("link", { name: "Activities" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Activities" }),
    ).not.toBeInTheDocument();
  });
});
