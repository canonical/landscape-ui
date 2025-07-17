import { describe, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import NavigationExpandable from "./NavigationExpandable";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { useGetOverLimitSecurityProfiles } from "@/features/security-profiles";

vi.mock("@/hooks/useAuth");
vi.mock("@/features/security-profiles/api/useGetOverLimitSecurityProfiles");

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setAuthLoading: vi.fn(),
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn(),
};

const linkWithChildren = MENU_ITEMS.find((i) => i.items && i.items.length > 0);
const securityProfilesLink = MENU_ITEMS.find((i) =>
  i.items?.some((child) => child.label === "Security profiles"),
);

if (!linkWithChildren || !securityProfilesLink) {
  throw new Error("Required menu items not found in constants.");
}

const renderItem = (item: MenuItem, path = "/") =>
  renderWithProviders(<NavigationExpandable item={item} />, undefined, path);

describe("NavigationExpandable", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authProps);
    vi.mocked(useGetOverLimitSecurityProfiles).mockReturnValue({
      hasOverLimitSecurityProfiles: true,
      isOverLimitSecurityProfilesLoading: false,
      overLimitSecurityProfiles: [],
      overLimitSecurityProfilesCount: 3,
    });
  });

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

  describe("security profiles badge", () => {
    it("should render when there is an over-limit profile", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: () => true,
      });

      renderItem(securityProfilesLink, "/");

      expect(screen.getByText(3)).toBeInTheDocument();

      vi.resetAllMocks();
    });

    it("should not render when the feature is disabled", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: () => false,
      });

      renderItem(securityProfilesLink, "/");

      expect(screen.queryByText(3)).not.toBeInTheDocument();

      vi.resetAllMocks();
    });
  });
});
