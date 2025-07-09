import type { AuthContextProps } from "@/context/auth";
import { useGetOverLimitSecurityProfiles } from "@/features/security-profiles";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import type { FeatureKey } from "@/types/FeatureKey";
import { screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import Navigation from "./Navigation";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useEnv");
vi.mock("@/features/security-profiles/api/useGetOverLimitSecurityProfiles");

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setAuthLoading: vi.fn(),
  setUser: vi.fn(),
  user: authUser,
  isOidcAvailable: true,
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn(),
};

const envCommon = {
  envLoading: false,
  packageVersion: "",
  revision: "",
};

const testMenuItem = (item: MenuItem, parentItem?: MenuItem) => {
  if (!item.env && !item.requiresFeature) {
    it(`should render ${item.label} page${parentItem ? " under " + parentItem?.label : ""}`, () => {
      renderWithProviders(<Navigation />);

      expect(screen.queryByText(item.label)).toBeInTheDocument();
    });
  }

  if (item.env) {
    it(`should render ${item.label} page in ${item.env}${parentItem ? " under " + parentItem?.label : ""}`, () => {
      vi.mocked(useEnv, { partial: true }).mockReturnValue({
        ...envCommon,
        isSaas: item.env === "saas",
        isSelfHosted: item.env === "selfHosted",
      });

      renderWithProviders(<Navigation />);

      expect(screen.queryByText(item.label)).toBeInTheDocument();
    });

    it(`should not render ${item.label} page in ${item.env === "selfHosted" ? "saas" : "selfHosted"}${parentItem ? " under " + parentItem?.label : ""}`, () => {
      vi.mocked(useEnv, { partial: true }).mockReturnValue({
        ...envCommon,
        isSaas: item.env !== "saas",
        isSelfHosted: item.env !== "selfHosted",
      });

      renderWithProviders(<Navigation />);

      expect(screen.queryByText(item.label)).not.toBeInTheDocument();
    });
  }

  if (item.requiresFeature) {
    it(`should render ${item.label} page with ${item.requiresFeature} enabled${parentItem ? " under " + parentItem?.label : ""}`, () => {
      vi.mocked(useAuth, { partial: true }).mockReturnValue({
        ...authProps,
        isOidcAvailable: false,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === item.requiresFeature,
      });
      renderWithProviders(<Navigation />);

      expect(screen.queryByText(item.label)).toBeInTheDocument();
    });

    it(`should not render ${item.label} page with ${item.requiresFeature} disabled${parentItem ? " under " + parentItem?.label : ""}`, () => {
      vi.mocked(useAuth, { partial: true }).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature !== item.requiresFeature,
      });
      renderWithProviders(<Navigation />);

      expect(screen.queryByText(item.label)).not.toBeInTheDocument();
    });
  }
};

describe("Navigation", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authProps);
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSaas: false,
      isSelfHosted: true,
    });
    vi.mocked(useGetOverLimitSecurityProfiles).mockReturnValue({
      hasOverLimitSecurityProfiles: true,
      isOverLimitSecurityProfilesLoading: false,
      overLimitSecurityProfiles: [],
      overLimitSecurityProfilesCount: 3,
    });
  });

  MENU_ITEMS.forEach((item) => {
    testMenuItem(item);

    if (item.items) {
      item.items.forEach((subItem) => {
        // Skipping for now to keep it simple because it's presented 2 times in the menu
        if ("GPG Keys" !== subItem.label) {
          testMenuItem(subItem, item);
        }
      });
    }
  });

  describe("security profiles badge", () => {
    it("should render when there is an over-limit profile", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: () => true,
      });

      renderWithProviders(<Navigation />);

      expect(screen.getByText(3)).toBeInTheDocument();

      vi.resetAllMocks();
    });

    it("should not render when the feature is disabled", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: () => false,
      });

      renderWithProviders(<Navigation />);

      expect(screen.queryByText(3)).not.toBeInTheDocument();

      vi.resetAllMocks();
    });
  });
});
