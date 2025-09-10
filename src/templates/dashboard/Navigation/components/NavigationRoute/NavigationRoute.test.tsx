import { describe, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import NavigationRoute from "./NavigationRoute";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";

const testLink: MenuItem = {
  label: "Test Route",
  path: "/test-route",
};

describe("NavigationRoute", () => {
  it("renders correctly", () => {
    renderWithProviders(<NavigationRoute item={testLink} />);

    const navItem = screen.getByRole("link", {
      name: testLink.label,
    });

    expect(navItem).toBeInTheDocument();
  });

  it("renders with badge", () => {
    const { container } = renderWithProviders(
      <NavigationRoute
        item={{ ...testLink, badge: { count: 23, isNegative: false } }}
      />,
    );

    const testId = 23;
    const label = container.querySelector(".p-side-navigation__label");

    expect(screen.queryByText(testId)).toBeInTheDocument();
    expect(label?.className).toContain("hasBadge");
  });

  it("renders current page", () => {
    renderWithProviders(<NavigationRoute item={testLink} current />);

    const navItem = screen.getByRole("link", {
      name: testLink.label,
    });

    expect(navItem).toHaveAttribute("aria-current", "page");
  });

  it("renders current page", () => {
    renderWithProviders(<NavigationRoute item={testLink} current />);

    const navItem = screen.getByRole("link", {
      name: testLink.label,
    });

    expect(navItem).toHaveAttribute("aria-current", "page");
  });

  it("renders with icon", () => {
    const { container } = renderWithProviders(
      <NavigationRoute item={{ ...testLink, icon: "test-icon" }} />,
    );

    const icon = container.querySelector(".p-icon--test-icon");

    expect(icon).toBeInTheDocument();
  });
});
