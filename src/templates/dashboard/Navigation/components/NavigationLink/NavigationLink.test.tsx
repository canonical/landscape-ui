import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import NavigationLink from "./NavigationLink";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";

const externalLink = MENU_ITEMS.find((i) => i.path.startsWith("http"));

if (!externalLink) {
  throw new Error("Required menu items not found in constants.");
}

describe("NavigationLink", () => {
  it("renders correctly", () => {
    renderWithProviders(<NavigationLink item={externalLink} />);

    const navItem = screen.getByRole("link", {
      name: externalLink.label,
    });

    expect(navItem).toBeInTheDocument();
    expect(navItem).toHaveAttribute("href", externalLink.path);
    expect(navItem).toHaveAttribute("target", "_blank");
  });
});
