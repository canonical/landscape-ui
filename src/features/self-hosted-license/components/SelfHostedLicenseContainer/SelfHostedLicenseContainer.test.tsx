import { renderWithProviders } from "@/tests/render";
import {
  regeneratedSelfHostedLicense,
  selfHostedLicense,
} from "@/tests/mocks/selfHostedLicense";
import { API_URL } from "@/constants";
import { AuthContext } from "@/context/auth";
import AccountsProvider from "@/context/accounts";
import { setEndpointStatus } from "@/tests/controllers/controller";
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
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      selfHostedLicense.license_url,
      "_blank",
      "noopener,noreferrer",
    );

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

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      regeneratedSelfHostedLicense.license_url,
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("shows the error toast and offers an inline retry for the download URL", async () => {
    const user = userEvent.setup();
    setEndpointStatus({
      status: "error",
      path: "self-hosted/license-url",
      response: {
        error: "ApiRequestError",
        message: "Account not enabled for self-hosted Landscape",
        detail: null,
      },
    });

    renderWithProviders(<SelfHostedLicenseContainer />);

    expect(
      await screen.findByText("Could not load the legacy license file"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Download license file" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Regenerate private token" }),
    ).not.toBeInTheDocument();
    expect(
      await screen.findByText("Account not enabled for self-hosted Landscape"),
    ).toBeInTheDocument();

    setEndpointStatus("default");
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("button", { name: "Download license file" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("offers a retry when the API returns no usable download URL", async () => {
    server.use(
      http.get(`${API_URL}self-hosted/license-url`, () =>
        HttpResponse.json({ license_url: "" }),
      ),
    );

    renderWithProviders(<SelfHostedLicenseContainer />);

    expect(
      await screen.findByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Could not load the legacy license file"),
    ).toBeInTheDocument();
  });

  it("shows loading instead of the form until the license URL is available", async () => {
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

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
    expect(
      screen.queryByRole("button", { name: "Download license file" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Regenerate private token" }),
    ).not.toBeInTheDocument();

    await act(async () => {
      releaseInitialRequest?.();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Regenerate private token" }),
      ).not.toHaveAttribute("aria-disabled");
    });
  });

  it("shows loading instead of the form before a license URL request fails", async () => {
    let releaseRequest: (() => void) | undefined;
    const request = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });
    server.use(
      http.get(`${API_URL}self-hosted/license-url`, async () => {
        await request;
        return HttpResponse.json(
          { message: "Request failed" },
          { status: 500 },
        );
      }),
    );

    try {
      renderWithProviders(<SelfHostedLicenseContainer />);

      expect(screen.getByRole("status")).toHaveTextContent("Loading...");
      expect(
        screen.queryByRole("button", { name: "Download license file" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Regenerate private token" }),
      ).not.toBeInTheDocument();

      await act(async () => {
        releaseRequest?.();
      });

      expect(
        await screen.findByText("Could not load the legacy license file"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Try again" }),
      ).toBeInTheDocument();
    } finally {
      releaseRequest?.();
    }
  });

  it("does not apply a regeneration response to a newly selected account", async () => {
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
    ];
    let requestIndex = 0;
    let releaseRegeneration: (() => void) | undefined;
    const regenerationStarted = new Promise<void>((resolveStarted) => {
      server.use(
        http.post(`${API_URL}self-hosted/license-url:regenerate`, async () => {
          resolveStarted();
          await new Promise<void>((resolveRegeneration) => {
            releaseRegeneration = resolveRegeneration;
          });
          return HttpResponse.json(regeneratedSelfHostedLicense);
        }),
      );
    });
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
            isSuperAdmin: false,
            canManageAccounts: false,
            canEnterAccounts: false,
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

    await user.click(
      screen.getByRole("button", { name: "Regenerate private token" }),
    );
    await regenerationStarted;
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

    await act(async () => {
      releaseRegeneration?.();
    });
    expect(
      await screen.findByText(
        "Private token and license download URL regenerated",
      ),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenLastCalledWith(
      accountLicenseUrls[1],
      "_blank",
      "noopener,noreferrer",
    );
  });
});
