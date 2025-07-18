import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import Navigation from "./Navigation";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { MENU_ITEMS } from "@/templates/dashboard/Navigation/constants";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import { authUser } from "@/tests/mocks/auth";
import type { FeatureKey } from "@/types/FeatureKey";
import type { AuthContextProps } from "@/context/auth";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useEnv");

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

const envCommon = {
  envLoading: false,
  packageVersion: "",
  revision: "",
};

interface EnvOverride {
  isSaas: boolean;
  isSelfHosted: boolean;
}

interface RenderOverrides {
  auth?: Partial<AuthContextProps>;
  env?: EnvOverride;
}

const renderNav = (overrides: RenderOverrides = {}, routePath = "/") => {
  vi.mocked(useAuth).mockReturnValue({ ...authProps, ...overrides.auth });
  vi.mocked(useEnv).mockReturnValue({
    ...envCommon,
    isSaas: overrides.env?.isSaas ?? false,
    isSelfHosted: overrides.env?.isSelfHosted ?? true,
  });

  return renderWithProviders(<Navigation />, undefined, routePath);
};

const getNavEl = (item: MenuItem) =>
  item.items
    ? screen.getByRole("button", { name: item.label })
    : screen.getByRole("link", { name: item.label });

const queryNavEl = (item: MenuItem) =>
  item.items
    ? screen.queryByRole("button", { name: item.label })
    : screen.queryByRole("link", { name: item.label });

const assertPresent = (item: MenuItem, parent?: MenuItem) => {
  const el = getNavEl(item);

  if (!item.items) {
    expect(el).toHaveAttribute("href", item.path);
    if (item.path.startsWith("http"))
      expect(el).toHaveAttribute("target", "_blank");
  }

  if (parent) {
    const parentEl = getNavEl(parent);
    const container = parentEl.closest("li") as HTMLElement;
    within(container).getByRole("link", { name: item.label });
  }
};

const assertAbsent = (item: MenuItem) => {
  expect(queryNavEl(item)).not.toBeInTheDocument();
};

describe("Navigation", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authProps);
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      isSaas: false,
      isSelfHosted: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("exposes navigation landmark with accessible name", () => {
    renderNav();
    expect(
      screen.getByRole("navigation", { name: /main/i }),
    ).toBeInTheDocument();
  });

  const flat: [MenuItem, MenuItem | undefined][] = [];
  MENU_ITEMS.forEach((item) => {
    flat.push([item, undefined]);
    item.items?.forEach((sub) => {
      if (sub.label.toLowerCase() !== "gpg keys") flat.push([sub, item]);
    });
  });

  flat.forEach(([item, parent]) => {
    if (!item.env && !item.requiresFeature) {
      it(`renders ${item.label}`, () => {
        renderNav();
        assertPresent(item, parent);
      });
    }

    if (item.env) {
      const match: EnvOverride =
        item.env === "saas"
          ? { isSaas: true, isSelfHosted: false }
          : { isSaas: false, isSelfHosted: true };

      it(`renders ${item.label} in ${item.env}`, () => {
        renderNav({ env: match });
        assertPresent(item, parent);
      });

      it(`does not render ${item.label} outside ${item.env}`, () => {
        renderNav({
          env: { isSaas: !match.isSaas, isSelfHosted: !match.isSelfHosted },
        });
        assertAbsent(item);
      });
    }

    if (item.requiresFeature) {
      it(`renders ${item.label} when feature ${item.requiresFeature} is enabled`, () => {
        renderNav({
          auth: {
            isFeatureEnabled: (f: FeatureKey) => f === item.requiresFeature,
          },
        });
        assertPresent(item, parent);
      });

      it(`does not render ${item.label} when feature ${item.requiresFeature} is disabled`, () => {
        renderNav({
          auth: {
            isFeatureEnabled: (f: FeatureKey) => f !== item.requiresFeature,
          },
        });
        assertAbsent(item);
      });
    }
  });

  it("marks active link based on current route", () => {
    renderNav({}, "/instances");
    expect(screen.getByRole("link", { name: "Instances" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
