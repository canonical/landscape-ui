import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import NavigationItem from "./NavigationItem";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";

const internalLinkNoChildren = MENU_ITEMS.find(
  (i) => !i.path.startsWith("http") && !i.items,
);
const externalLink = MENU_ITEMS.find((i) => i.path.startsWith("http"));
const linkWithChildren = MENU_ITEMS.find((i) => i.items && i.items.length > 0);
const linkWithDivider = MENU_ITEMS.find((i) => i.hasDivider);

if (
  !internalLinkNoChildren ||
  !externalLink ||
  !linkWithChildren ||
  !linkWithDivider
) {
  throw new Error("Required menu items not found in constants.");
}

const renderItem = (item: MenuItem, path = "/") =>
  renderWithProviders(<NavigationItem item={item} />, undefined, path);

describe("NavigationItem", () => {
  describe("render internal links without children", () => {
    it("renders correct path", () => {
      renderItem(internalLinkNoChildren, internalLinkNoChildren.path);

      const navItem = screen.getByRole("link", {
        name: internalLinkNoChildren.label,
      });

      expect(navItem).toHaveAttribute("href", internalLinkNoChildren.path);
    });

    it("sets current true when active", () => {
      renderItem(internalLinkNoChildren, internalLinkNoChildren.path);

      const navItem = screen.getByRole("link", {
        name: internalLinkNoChildren.label,
      });

      expect(navItem).toHaveAttribute("aria-current", "page");
    });

    it("sets false when not active", () => {
      renderItem(internalLinkNoChildren, "/");

      const navItem = screen.getByRole("link", {
        name: internalLinkNoChildren.label,
      });

      expect(navItem).not.toHaveAttribute("aria-current", "page");
    });
  });

  it("renders external link", () => {
    renderItem(linkWithDivider);

    const navItem = screen.getByRole("link", {
      name: linkWithDivider.label,
    });

    expect(navItem).toHaveAttribute("href", linkWithDivider.path);
    expect(navItem).toHaveAttribute("target", "_blank");
  });

  it("applies divider class", () => {
    renderItem(linkWithDivider);

    const listItem = screen.getByRole("listitem");

    expect(listItem.className).toContain("hasDivider");
  });

  it("renders items with children", () => {
    renderItem(linkWithChildren);

    const expandableItem = screen.getByRole("button", {
      name: linkWithChildren.label,
    });

    expect(expandableItem).toBeInTheDocument();
  });
});
