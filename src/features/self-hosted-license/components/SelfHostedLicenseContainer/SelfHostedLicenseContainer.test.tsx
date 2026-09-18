import { renderWithProviders } from "@/tests/render";
import {
  regeneratedSelfHostedLicense,
  selfHostedLicense,
} from "@/tests/mocks/selfHostedLicense";
import { API_URL } from "@/constants";
import { AuthContext } from "@/context/auth";
import AccountsProvider from "@/context/accounts";
import { authUser } from "@/tests/mocks/auth";
import server from "@/tests/server";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SelfHostedLicenseContainer from "./SelfHostedLicenseContainer";

describe("SelfHostedLicenseContainer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("propagates the fetched license URL to the download button", async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderWithProviders(<SelfHostedLicenseContainer />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      selfHostedLicense.license_url,
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("replaces the download URL everywhere after regenerating the license", async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderWithProviders(<SelfHostedLicenseContainer />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    await user.click(
      screen.getByRole("button", { name: "Regenerate private token" }),
    );

    expect(
      await screen.findByText(
        "Private token and license download URL regenerated",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      regeneratedSelfHostedLicense.license_url,
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("shows an error notification and keeps download and regenerate disabled", async () => {
    server.use(
      http.get(
        `${API_URL}self-hosted/license-url`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderWithProviders(<SelfHostedLicenseContainer />);

    expect(
      await screen.findByText("Unable to get the license download URL"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The license download URL could not be loaded."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download license file" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByRole("button", { name: "Regenerate private token" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();
  });

  it("enables regeneration only after the license URL is available", async () => {
    let releaseInitialRequest: (() => void) | undefined;
    const initialRequestStarted = new Promise<void>((resolveStarted) => {
      server.use(
        http.get(`${API_URL}self-hosted/license-url`, async () => {
          resolveStarted();
          await new Promise<void>((resolveRequest) => {
            releaseInitialRequest = resolveRequest;
          });
          return HttpResponse.json(selfHostedLicense);
        }),
      );
    });

    renderWithProviders(<SelfHostedLicenseContainer />);
    await initialRequestStarted;

    expect(
      screen.getByRole("button", { name: "Regenerate private token" }),
    ).toHaveAttribute("aria-disabled", "true");

    await act(async () => {
      releaseInitialRequest?.();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Regenerate private token" }),
      ).not.toHaveAttribute("aria-disabled");
    });
  });

  it("fetches the license URL for the newly selected account", async () => {
    const [firstAccount, secondAccount] = authUser.accounts;
    assert(firstAccount);
    assert(secondAccount);
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    const accountLicenseUrls = [
      "https://first-account.example.com/license.txt",
      "https://second-account.example.com/license.txt",
      "https://first-account.example.com/refetched-license.txt",
    ];
    let requestIndex = 0;
    server.use(
      http.get(`${API_URL}self-hosted/license-url`, () =>
        HttpResponse.json({
          license_url: accountLicenseUrls[requestIndex++],
        }),
      ),
    );

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
      <AccountSwitchHarness>
        <SelfHostedLicenseContainer />
      </AccountSwitchHarness>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });
    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );
    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      accountLicenseUrls[0],
      "_blank",
      "noopener,noreferrer",
    );

    await user.click(screen.getByRole("button", { name: "Switch account" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });
    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      accountLicenseUrls[1],
      "_blank",
      "noopener,noreferrer",
    );

    await user.click(screen.getByRole("button", { name: "Switch account" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });
    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      accountLicenseUrls[2],
      "_blank",
      "noopener,noreferrer",
    );
  });
});
