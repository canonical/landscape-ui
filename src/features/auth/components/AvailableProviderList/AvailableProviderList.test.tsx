import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  identityProviders,
  oidcLocationToRedirectTo,
} from "@/tests/mocks/identityProviders";
import type { AvailableProviderListProps } from "@/features/auth";

const oidcProviders = identityProviders.filter(({ enabled }) => enabled);
const redirectToExternalUrl = vi.hoisted(() => vi.fn());

const props: AvailableProviderListProps = {
  oidcProviders,
  isUbuntuOneEnabled: true,
  isStandaloneOidcEnabled: false,
};

describe("AvailableProviderList", () => {
  beforeEach(() => {
    vi.resetModules();

    vi.mock("../../helpers", async (importOriginal) => ({
      ...(await importOriginal()),
      redirectToExternalUrl,
    }));

    vi.doMock("@/features/auth", async () => {
      const actual = await vi.importActual("@/features/auth");
      return {
        ...actual,
        useGetUbuntuOneUrl: (_params: never, enabled: boolean) => {
          if (enabled) {
            return {
              location: "https://login.ubuntu.com/mock",
              isLoading: false,
            };
          }
          return { location: undefined, isLoading: false };
        },
      };
    });

    vi.doMock("../../api", async () => {
      return {
        useGetOidcUrlQuery: (_params: never, options: { enabled: boolean }) => {
          if (options.enabled) {
            return {
              oidcUrlLocation: `${window.location.origin}${oidcLocationToRedirectTo}`,
            };
          }
          return { oidcUrlLocation: undefined };
        },
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to an external url when clicking OIDC provider", async () => {
    const { AvailableProviderList } = await import("./AvailableProviderList");
    renderWithProviders(<AvailableProviderList {...props} />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Sign in with Okta Enabled" }),
    );

    expect(redirectToExternalUrl).toHaveBeenCalledWith(
      `${window.location.origin}${oidcLocationToRedirectTo}`,
    );
  });

  it("should redirect to Ubuntu One url when clicking Ubuntu One", async () => {
    const { AvailableProviderList } = await import("./AvailableProviderList");
    renderWithProviders(<AvailableProviderList {...props} />);

    const ubuntuButton = await screen.findByRole("button", {
      name: /Sign in with Ubuntu One/i,
    });
    await userEvent.click(ubuntuButton);

    expect(redirectToExternalUrl).toHaveBeenCalledWith(
      "https://login.ubuntu.com/mock",
    );
  });
});
