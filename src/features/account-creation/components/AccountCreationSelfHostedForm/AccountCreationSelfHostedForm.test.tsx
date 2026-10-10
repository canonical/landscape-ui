import { setEndpointStatus } from "@/tests/controllers/controller";
import {
  noneLoginMethods,
  oidcOnlyLoginMethods,
  pamLoginMethods,
} from "@/tests/mocks/loginMethods";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AccountCreationSelfHostedForm from "./AccountCreationSelfHostedForm";

const navigateMock = vi.fn();
const authMock = vi.hoisted(() => ({
  setUser: vi.fn(),
}));

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => navigateMock,
}));

vi.mock("@/hooks/useAuth", () => ({
  default: () => authMock,
}));

describe("AccountCreationSelfHostedForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("selects the PAM form when PAM authentication is enabled", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: pamLoginMethods,
    });

    renderWithProviders(<AccountCreationSelfHostedForm />);

    expect(
      await screen.findByRole("heading", {
        name: "Create a new Landscape account with PAM",
      }),
    ).toBeInTheDocument();
  });

  it("redirects to login when only a federated method (Ubuntu one and/or OIDC) is enabled", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: {
        ...noneLoginMethods,
        ubuntu_one: { available: true, enabled: true },
      },
    });

    renderWithProviders(<AccountCreationSelfHostedForm />);

    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login", {
        replace: true,
        state: { allowFederatedLogin: true },
      });
    });
  });

  it("redirects to login when only generic OIDC is enabled", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: {
        ...oidcOnlyLoginMethods,
        password: noneLoginMethods.password,
      },
    });

    renderWithProviders(<AccountCreationSelfHostedForm />);

    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login", {
        replace: true,
        state: { allowFederatedLogin: true },
      });
    });
    expect(
      screen.queryByText(/no login methods are configured/i),
    ).not.toBeInTheDocument();
  });

  it.each([false, true])(
    "offers generic OIDC sign-in alongside account creation with PAM=%s",
    async (pamEnabled) => {
      setEndpointStatus({
        status: "variant",
        path: "login/methods",
        response: {
          ...oidcOnlyLoginMethods,
          pam: { available: pamEnabled, enabled: pamEnabled },
          password: pamEnabled
            ? noneLoginMethods.password
            : oidcOnlyLoginMethods.password,
        },
      });

      renderWithProviders(<AccountCreationSelfHostedForm />);

      expect(
        await screen.findByRole("heading", {
          name: pamEnabled
            ? "Create a new Landscape account with PAM"
            : "Create a new Landscape account",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Sign in with OIDC instead" }),
      ).toHaveAttribute("href", ROUTES.auth.login());
      expect(navigateMock).not.toHaveBeenCalled();
    },
  );

  it.each([
    { available: false, enabled: true },
    { available: true, enabled: false },
  ])(
    "does not redirect for generic OIDC with available=$available and enabled=$enabled",
    async ({ available, enabled }) => {
      setEndpointStatus({
        status: "variant",
        path: "login/methods",
        response: {
          ...noneLoginMethods,
          oidc: {
            available,
            configurations: oidcOnlyLoginMethods.oidc.configurations.map(
              (provider) => ({ ...provider, enabled }),
            ),
          },
        },
      });

      renderWithProviders(<AccountCreationSelfHostedForm />);

      expect(
        await screen.findByText(/no login methods are configured/i),
      ).toBeInTheDocument();
      expect(navigateMock).not.toHaveBeenCalled();
    },
  );

  it("shows an error when no login methods are configured", async () => {
    setEndpointStatus({
      status: "variant",
      path: "login/methods",
      response: noneLoginMethods,
    });

    renderWithProviders(<AccountCreationSelfHostedForm />);

    expect(
      await screen.findByText(
        "No login methods are configured. Ask your system administrator to configure password, PAM, OIDC, or Ubuntu One.",
      ),
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("shows a support message when login methods fail to load", async () => {
    setEndpointStatus({ status: "error", path: "login/methods" });

    renderWithProviders(<AccountCreationSelfHostedForm />);

    expect(
      await screen.findByText(CONTACT_SUPPORT_TEAM_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/no login methods are configured/i),
    ).not.toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
