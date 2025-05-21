import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import SecondaryNavigation from "./SecondaryNavigation";
import { ACCOUNT_SETTINGS } from "./constants";
import { ROUTE_PATHS, ROUTES } from "@/libs/routes";

describe("SecondaryNavigation", () => {
  it("renders correctly", () => {
    renderWithProviders(<SecondaryNavigation />);

    expect(
      screen.getByRole("heading", { name: ACCOUNT_SETTINGS.label }),
    ).toBeInTheDocument();
    ACCOUNT_SETTINGS.items?.forEach((item) => {
      expect(
        screen.getByRole("link", { name: item.label }),
      ).toBeInTheDocument();
    });
  });

  it("can set an active item", () => {
    assert(ACCOUNT_SETTINGS.items);

    renderWithProviders(
      <SecondaryNavigation />,
      {},
      ROUTES.accountGeneral(),
      ROUTE_PATHS.accountGeneral,
    );

    const activeLink = screen.getByRole("link", {
      name: ACCOUNT_SETTINGS.items[0].label,
    });
    expect(activeLink.className).toContain("isActive");

    expect(
      screen.getByRole("link", { name: ACCOUNT_SETTINGS.items[1].label }),
    ).not.toHaveClass("isActive");
  });
});
