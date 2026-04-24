import { INSTANCES_PATHS } from "@/libs/routes/instances";
import useAuth from "@/hooks/useAuth";
import { instances } from "@/tests/mocks/instance";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { getInstanceWithUbuntuPro } from "../../helpers";
import UbuntuProHeader from "./UbuntuProHeader";
import type { AuthContextProps } from "@/context/auth";

vi.mock("@/hooks/useAuth");

const instanceWithUbuntuPro = getInstanceWithUbuntuPro(instances);
const singleInstancePath = `/${INSTANCES_PATHS.root}/${INSTANCES_PATHS.single}`;

const baseAuth: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: () => true,
  hasAccounts: true,
};

describe("UbuntuProHeader", () => {
  if (!instanceWithUbuntuPro) {
    throw new Error("No instance with Ubuntu Pro found in mock data");
  }

  const ubuntuProData = instanceWithUbuntuPro.ubuntu_pro_info;
  if (ubuntuProData?.result !== "success") {
    throw new Error("Invalid ubuntu_pro_info");
  }

  const user = userEvent.setup();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(baseAuth);
  });

  it("renders header with account information title", () => {
    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
  });

  it("renders Ubuntu Pro dashboard link", () => {
    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    const link = screen.getByRole("link", {
      name: "Ubuntu Pro Dashboard",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://ubuntu.com/pro/dashboard");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });

  it("opens replace token side panel when Edit token is clicked", async () => {
    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    await user.click(screen.getByRole("button", { name: /edit token/i }));

    expect(screen.getByText("Replace Ubuntu Pro Token")).toBeInTheDocument();
  });

  it("opens detach token modal when Detach token is clicked", async () => {
    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    const detachButton = screen.getByRole("button", { name: /detach token/i });
    await user.click(detachButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /detach ubuntu pro token/i }),
      ).toBeInTheDocument();
    });
  });

  it("hides Detach token button when ubuntu-pro-licensing feature is disabled", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      isFeatureEnabled: () => false,
    });

    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    expect(
      screen.queryByRole("button", { name: /detach token/i }),
    ).not.toBeInTheDocument();
  });
});
