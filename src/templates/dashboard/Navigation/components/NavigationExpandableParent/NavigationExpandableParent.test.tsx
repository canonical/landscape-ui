import { describe, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import NavigationExpandableParent from "./NavigationExpandableParent";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";

const linkWithChildren = MENU_ITEMS.find((i) => i.items && i.items.length > 0);

if (!linkWithChildren) {
  throw new Error("Required menu items not found in constants.");
}

const onClick = vi.fn();

describe("NavigationExpandableParent", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <NavigationExpandableParent
        item={linkWithChildren}
        expanded=""
        onClick={onClick}
      />,
    );

    const navItem = screen.getByRole("button", {
      name: linkWithChildren.label,
    });

    expect(navItem).toBeInTheDocument();
  });
});
