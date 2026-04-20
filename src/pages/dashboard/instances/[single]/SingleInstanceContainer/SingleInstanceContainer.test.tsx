import { renderWithProviders } from "@/tests/render";
import { PATHS, ROUTES } from "@/libs/routes";
import { render, screen } from "@testing-library/react";
import { describe } from "vitest";
import userEvent from "@testing-library/user-event";
import SingleInstanceContainer from "./SingleInstanceContainer";
import { AuthContext } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { AppProviders } from "@/providers/AppProviders";
import { useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router";

const INSTANCE_ID = 11;
const INSTANCE_WITHOUT_DISTRIBUTION_ID = 12;
const MISSING_INSTANCE_ID = 99999;

describe("SingleInstanceContainer", () => {
  describe("component", () => {
    it("renders tabs for a found instance", async () => {
      renderWithProviders(
        <SingleInstanceContainer />,
        undefined,
        ROUTES.instances.details.single(INSTANCE_ID, { tab: "activities" }),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      expect(
        await screen.findByRole("tab", { name: "Info" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Activities" }),
      ).toBeInTheDocument();
    });

    it("renders empty state when instance is not found", async () => {
      renderWithProviders(
        <SingleInstanceContainer />,
        undefined,
        ROUTES.instances.details.single(MISSING_INSTANCE_ID, { tab: "info" }),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      expect(await screen.findByText("Instance not found")).toBeInTheDocument();
    });

    it("renders details for instances without distribution data", async () => {
      renderWithProviders(
        <SingleInstanceContainer />,
        undefined,
        ROUTES.instances.details.single(INSTANCE_WITHOUT_DISTRIBUTION_ID, {
          tab: "activities",
        }),
        `/${PATHS.instances.root}/${PATHS.instances.single}`,
      );

      expect(
        await screen.findByRole("tab", { name: "Info" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Activities" }),
      ).toBeInTheDocument();
    });

    it("redirects to root route when current account changes", async () => {
      const user = userEvent.setup();

      const AccountSwitchHarness = () => {
        const [currentAccount, setCurrentAccount] = useState("account-a");

        const userWithCurrentAccount = {
          ...authUser,
          current_account: currentAccount,
          accounts: [
            {
              ...authUser.accounts[0],
              name: currentAccount,
              title: currentAccount,
              subdomain: null,
              classic_dashboard_url: "",
            },
          ],
        };

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
              user: userWithCurrentAccount,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setCurrentAccount("account-b");
              }}
            >
              Switch account
            </button>
            <SingleInstanceContainer />
          </AuthContext.Provider>
        );
      };

      render(
        <MemoryRouter
          initialEntries={[ROUTES.instances.details.single(INSTANCE_ID)]}
        >
          <AppProviders>
            <Routes>
              <Route
                path={`/${PATHS.instances.root}`}
                element={<p>Instances root page</p>}
              />
              <Route
                path={`/${PATHS.instances.root}/${PATHS.instances.single}`}
                element={<AccountSwitchHarness />}
              />
            </Routes>
          </AppProviders>
        </MemoryRouter>,
      );

      expect(
        await screen.findByRole("tab", { name: "Info" }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Switch account" }));

      expect(
        await screen.findByText("Instances root page"),
      ).toBeInTheDocument();
    });
  });
});
