import { beforeEach, describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AvailableProviderList from "./AvailableProviderList";
import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import {
  identityProviders,
  locationToRedirectTo,
} from "@/tests/mocks/identityProviders";
import userEvent from "@testing-library/user-event";

const oidcProviders = identityProviders.filter(({ enabled }) => enabled);
const redirectToExternalUrl = vi.hoisted(() => vi.fn());

const props: ComponentProps<typeof AvailableProviderList> = {
  oidcProviders,
  isUbuntuOneEnabled: false,
  isStandaloneOidcEnabled: false,
};

describe("AvailableProviderList", () => {
  beforeEach(() => {
    renderWithProviders(<AvailableProviderList {...props} />);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should redirect to an external url", async () => {
    vi.mock("../../helpers", async (importOriginal) => ({
      ...(await importOriginal()),
      redirectToExternalUrl,
    }));

    await userEvent.click(
      await screen.findByRole("button", { name: "Sign in with Okta Enabled" }),
    );

    expect(redirectToExternalUrl).toHaveBeenCalledWith(locationToRedirectTo);
  });
});
