import { setEndpointStatus } from "@/tests/controllers/controller";
import { noneLoginMethods, pamLoginMethods } from "@/tests/mocks/loginMethods";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
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
});
