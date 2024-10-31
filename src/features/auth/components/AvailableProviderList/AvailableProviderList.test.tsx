import { beforeEach, describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AvailableProviderList from "./AvailableProviderList";
import { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import {
  identityProviders,
  locationToRedirectTo,
} from "@/tests/mocks/identityProviders";
import userEvent from "@testing-library/user-event";

const oidcProviders = identityProviders.filter(({ enabled }) => enabled);
const redirectToExternalUrl = vi.hoisted(() => vi.fn());

const props: ComponentProps<typeof AvailableProviderList> = {
  isStandaloneOidcEnabled: false,
  isUbuntuOneEnabled: false,
  oidcProviders,
};

describe("AvailableProviderList", () => {
  beforeEach(({ task: { id } }) => {
    renderWithProviders(
      <AvailableProviderList
        {...props}
        isUbuntuOneEnabled={id.endsWith("1")}
        isStandaloneOidcEnabled={id.endsWith("2")}
      />,
    );
  });

  it("should render the available provider list", async () => {
    expect(
      screen.queryByRole("button", { name: "Ubuntu One" }),
    ).not.toBeInTheDocument();

    expect(await screen.findAllByRole("listitem")).toHaveLength(
      oidcProviders.length,
    );
  });

  it("should render 'Ubuntu One' button within the list", async () => {
    expect(
      await screen.findByRole("button", { name: "Sign in with Ubuntu One" }),
    ).toBeInTheDocument();

    expect(await screen.findAllByRole("listitem")).toHaveLength(
      oidcProviders.length + 1,
    );
  });

  it("should render 'Enterprise Login' button within the list", async () => {
    expect(
      await screen.findByRole("button", {
        name: "Sign in with Enterprise Login",
      }),
    ).toBeInTheDocument();

    expect(await screen.findAllByRole("listitem")).toHaveLength(
      oidcProviders.length + 1,
    );
  });

  it("should redirect to an external url", async () => {
    vi.mock("../../helpers", () => ({
      redirectToExternalUrl,
    }));

    await userEvent.click(
      await screen.findByRole("button", { name: "Sign in with Okta Onward" }),
    );

    expect(redirectToExternalUrl).toHaveBeenCalledWith(locationToRedirectTo);
  });
});
