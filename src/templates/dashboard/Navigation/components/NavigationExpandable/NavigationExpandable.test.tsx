import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import NavigationExpandable from "./NavigationExpandable";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";

const linkWithChildren = MENU_ITEMS.find((i) => i.items && i.items.length > 0);

if (!linkWithChildren) {
  throw new Error("Required menu items not found in constants.");
}

const renderItem = (item: MenuItem, path = "/") =>
  renderWithProviders(<NavigationExpandable item={item} />, undefined, path);

describe("NavigationExpandable", () => {
  it("renders submenu", () => {
    renderItem(linkWithChildren, "/");

    const navItem = screen.getByRole("button", {
      name: linkWithChildren.label,
    });

    expect(navItem).toBeInTheDocument();

    const subItems = screen.getAllByRole("listitem");
    expect(subItems.length).toBeGreaterThan(0);
  });

  it("renders children when clicked", async () => {
    renderItem(linkWithChildren, "/");

    const navItem = screen.getByRole("button", {
      name: linkWithChildren.label,
    });
    const subMenu = screen.getByRole("list");

    expect(subMenu).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(navItem);

    expect(subMenu).toHaveAttribute("aria-expanded", "true");
  });

  it("expands by default when any child is active", () => {
    const randomChild = linkWithChildren.items?.[0];

    if (!randomChild) {
      throw new Error("No child items found for the link with children.");
    }

    renderItem(linkWithChildren, randomChild.path);

    const subMenu = screen.getByRole("list");

    expect(subMenu).toHaveAttribute("aria-expanded", "true");

    const activeItem = screen.getByRole("link", {
      name: randomChild.label,
    });

    expect(activeItem).toHaveAttribute("aria-current", "page");
  });
});
