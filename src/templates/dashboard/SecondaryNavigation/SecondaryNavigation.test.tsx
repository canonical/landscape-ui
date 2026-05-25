import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SecondaryNavigation from "./SecondaryNavigation";
import { ACCOUNT_SETTINGS } from "./constants";
import { PATHS, ROUTES } from "@/libs/routes";
import { useMediaQuery } from "usehooks-ts";

// Mock useMediaQuery to simulate large screen
vi.mock("usehooks-ts", async () => {
  const actual = await vi.importActual("usehooks-ts");
  return {
    ...actual,
    useMediaQuery: vi.fn(() => true), // Always return true for large screen
  };
});

describe("SecondaryNavigation", () => {
  it("renders correctly", () => {
    renderWithProviders(
      <SecondaryNavigation
        title={ACCOUNT_SETTINGS.label}
        items={ACCOUNT_SETTINGS.items}
      />,
    );

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
      <SecondaryNavigation
        title={ACCOUNT_SETTINGS.label}
        items={ACCOUNT_SETTINGS.items}
      />,
      {},
      ROUTES.account.general(),
      `/${PATHS.account.root}/${PATHS.account.general}`,
    );

    const activeLink = screen.getByRole("link", {
      name: ACCOUNT_SETTINGS.items[0].label,
    });
    // CSS Module class names are hashed (e.g., "SecondaryNavigation_isActive__abc123")
    // Use regex to match the generated class containing "isActive"
    expect(activeLink.className).toMatch(/isActive/);

    expect(
      screen.getByRole("link", { name: ACCOUNT_SETTINGS.items[1].label }),
    ).not.toHaveClass(/isActive/);
  });

  it("renders nothing on small screens", () => {
    vi.mocked(useMediaQuery).mockImplementation(() => false);

    renderWithProviders(
      <SecondaryNavigation
        title={ACCOUNT_SETTINGS.label}
        items={ACCOUNT_SETTINGS.items}
      />,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    vi.mocked(useMediaQuery).mockImplementation(() => true);
  });

  it("renders children when provided", () => {
    renderWithProviders(
      <SecondaryNavigation
        title={ACCOUNT_SETTINGS.label}
        items={ACCOUNT_SETTINGS.items}
      >
        <button>Footer action</button>
      </SecondaryNavigation>,
    );

    expect(
      screen.getByRole("button", { name: "Footer action" }),
    ).toBeInTheDocument();
  });
});
