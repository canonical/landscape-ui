import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EnvContext, type EnvContextState } from "@/context/env";
import { allLoginMethods } from "@/tests/mocks/loginMethods";
import { setEndpointStatus } from "@/tests/controllers/controller";
import InvitationWelcome from "./InvitationWelcome";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";

describe("InvitationWelcome", () => {
  const defaultProps: ComponentProps<typeof InvitationWelcome> = {
    accountTitle: "Test Account",
  };

  it("should show account creation when opening an invitation", async () => {
    renderWithProviders(<InvitationWelcome {...defaultProps} />);

    expect(
      await screen.findByText("Create a user to join Test Account"),
    ).toBeInTheDocument();
  });

  it("shows sign-in methods when the invitee chooses to sign in", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InvitationWelcome {...defaultProps} />);
    await screen.findByText("Create a user to join Test Account");

    await user.click(
      screen.getByRole("button", {
        name: "Already have an account? Sign in here",
      }),
    );
    expect(screen.getByText("Sign in with Ubuntu One")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create user" }),
    ).not.toBeInTheDocument();
  });

  it("does not offer PAM registration in SaaS", async () => {
    const saasEnv: EnvContextState = {
      envLoading: false,
      isSaas: true,
      isSelfHosted: false,
      packageVersion: "",
      revision: "",
      displayDisaStigBanner: false,
    };
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: {
        ...allLoginMethods,
        pam: { available: true, enabled: true },
      },
    });

    renderWithProviders(
      <InvitationWelcome {...defaultProps} />,
      undefined,
      undefined,
      undefined,
      ({ children }) => (
        <EnvContext.Provider value={saasEnv}>{children}</EnvContext.Provider>
      ),
    );

    expect(
      await screen.findByText("Create a user to join Test Account"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Create a PAM user to join Test Account"),
    ).not.toBeInTheDocument();
  });

  it("should show error message when login methods fail to load", async () => {
    setEndpointStatus("error");

    renderWithProviders(<InvitationWelcome {...defaultProps} />);
    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE, undefined, {
        timeout: 3000,
      }),
    ).toBeInTheDocument();
  });
});
