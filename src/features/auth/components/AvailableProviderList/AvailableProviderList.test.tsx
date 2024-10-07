import { beforeEach, describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AvailableProviderList from "./AvailableProviderList";
import { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import {
  identityProviders,
  invitations,
  locationToRedirectTo,
} from "@/tests/mocks/identityProviders";
import userEvent from "@testing-library/user-event";

const invitation_id = "1";
const oidcProviders = identityProviders.filter(({ enabled }) => enabled);
const onInvitation = vi.fn();
const redirectTo = vi.fn();

const props: ComponentProps<typeof AvailableProviderList> = {
  isUbuntuOneEnabled: false,
  oidcProviders,
  onInvitation,
};

describe("AvailableProviderList", () => {
  beforeEach(({ task: { id } }) => {
    renderWithProviders(
      <AvailableProviderList
        {...props}
        isUbuntuOneEnabled={id.endsWith("1")}
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

  it("should handle invitation", async () => {
    vi.mock("react-router-dom", async () => ({
      ...(await vi.importActual("react-router-dom")),
      useSearchParams: () => [new URLSearchParams({ invitation_id })],
    }));

    expect(onInvitation).toHaveBeenCalledWith(
      invitations.find(({ secure_id }) => secure_id === invitation_id)
        ?.account_title,
    );
  });

  it("should redirect to an external url", async () => {
    vi.mock("./helpers", () => ({
      redirectToExternalUrl: (url: string) => redirectTo(url),
    }));

    await userEvent.click(
      await screen.findByRole("button", { name: "Sign in with Okta Onward" }),
    );

    expect(redirectTo).toHaveBeenCalledWith(locationToRedirectTo);
  });
});
