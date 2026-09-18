import { renderWithProviders } from "@/tests/render";
import { EnvContext, type EnvContextState } from "@/context/env";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SecondaryNavigation from "./SecondaryNavigation";
import { ACCOUNT_SETTINGS } from "./constants";
import { PATHS, ROUTES } from "@/libs/routes";
import { useMediaQuery } from "usehooks-ts";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { AuthContext } from "@/context/auth";
import AccountsProvider from "@/context/accounts";
import { authUser } from "@/tests/mocks/auth";
import server from "@/tests/server";
import { API_URL } from "@/constants";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { useState } from "react";

const resolvedEnvState: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

// Mock useMediaQuery to simulate large screen
vi.mock("usehooks-ts", async () => {
  const actual = await vi.importActual("usehooks-ts");
  return {
    ...actual,
    useMediaQuery: vi.fn(() => true), // Always return true for large screen
  };
});

describe("SecondaryNavigation", () => {
  it("renders correctly", async () => {
    renderWithProviders(
      <EnvContext.Provider value={resolvedEnvState}>
        <SecondaryNavigation
          title={ACCOUNT_SETTINGS.label}
          items={ACCOUNT_SETTINGS.items}
        />
      </EnvContext.Provider>,
    );

    expect(
      screen.getByRole("heading", { name: ACCOUNT_SETTINGS.label }),
    ).toBeInTheDocument();
    await Promise.all(
      ACCOUNT_SETTINGS.items?.map(async (item) => {
        expect(
          await screen.findByRole("link", { name: item.label }),
        ).toBeInTheDocument();
      }) ?? [],
    );
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

  it("hides the self-hosted license item when the account is not entitled", async () => {
    setEndpointStatus({
      status: "variant",
      path: "self-hosted/status",
      response: { enabled: false },
    });

    renderWithProviders(
      <EnvContext.Provider value={resolvedEnvState}>
        <SecondaryNavigation
          title={ACCOUNT_SETTINGS.label}
          items={ACCOUNT_SETTINGS.items}
        />
      </EnvContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "aria-busy",
        "false",
      );
    });
    expect(
      screen.queryByRole("link", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();
  });

  it("rechecks entitlement after switching accounts", async () => {
    const [firstAccount, secondAccount] = authUser.accounts;
    assert(firstAccount);
    assert(secondAccount);
    let requestIndex = 0;
    const entitlementByRequest = [true, false, true];
    server.use(
      http.get(`${API_URL}self-hosted/status`, () =>
        HttpResponse.json({ enabled: entitlementByRequest[requestIndex++] }),
      ),
    );
    const user = userEvent.setup();

    const AccountSwitchHarness = ({
      children,
    }: {
      readonly children: ReactNode;
    }) => {
      const [currentAccount, setCurrentAccount] = useState(firstAccount.name);

      return (
        <AuthContext.Provider
          value={{
            authLoading: false,
            authorized: true,
            hasAccounts: true,
            isFeatureEnabled: () => true,
            logout: vi.fn(),
            redirectToExternalUrl: vi.fn(),
            safeRedirect: vi.fn(),
            setUser: vi.fn(),
            user: { ...authUser, current_account: currentAccount },
          }}
        >
          <AccountsProvider>
            <button
              type="button"
              onClick={() => {
                setCurrentAccount((accountName) =>
                  accountName === firstAccount.name
                    ? secondAccount.name
                    : firstAccount.name,
                );
              }}
            >
              Switch account
            </button>
            {children}
          </AccountsProvider>
        </AuthContext.Provider>
      );
    };

    renderWithProviders(
      <EnvContext.Provider value={resolvedEnvState}>
        <AccountSwitchHarness>
          <SecondaryNavigation
            title={ACCOUNT_SETTINGS.label}
            items={ACCOUNT_SETTINGS.items}
          />
        </AccountSwitchHarness>
      </EnvContext.Provider>,
    );

    expect(
      await screen.findByRole("link", { name: "Legacy license file" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Switch account" }));

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "aria-busy",
        "false",
      );
    });
    expect(
      screen.queryByRole("link", { name: "Legacy license file" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Switch account" }));

    await waitFor(() => {
      expect(requestIndex).toBe(3);
    });
    expect(
      screen.getByRole("link", { name: "Legacy license file" }),
    ).toBeInTheDocument();
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
