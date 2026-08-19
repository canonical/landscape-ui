import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserInfo from "./UserInfo";
import { APP_COMMIT, APP_VERSION } from "@/constants";
import { vi } from "vitest";
import useAuth from "@/hooks/useAuth";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";

vi.mock("@/hooks/useAuth");

const mockAuth: AuthContextProps = {
  logout: vi.fn(),
  authorized: false,
  authLoading: false,
  setUser: vi.fn(),
  user: null,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  hasAccounts: false,
};

const labels = ["Unknown user", "Alerts", "Sign out"];

describe("UserInfo", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);
  });

  it("renders correctly", () => {
    renderWithProviders(<UserInfo />);

    expect(
      screen.getByText(
        `v${APP_VERSION} (${APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"})`,
      ),
    ).toBeInTheDocument();
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders Sign out button that can be clicked", async () => {
    renderWithProviders(<UserInfo />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();

    // Should not throw when clicked
    await userEvent.click(signOutButton);
  });

  it("calls logout when sign out is clicked and mutation succeeds", async () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, logout });
    renderWithProviders(<UserInfo />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    await userEvent.click(signOutButton);

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });

  it("handles logout error gracefully without calling logout", async () => {
    setEndpointStatus({ status: "error", path: "logout" });
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ ...mockAuth, logout });
    renderWithProviders(<UserInfo />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    await userEvent.click(signOutButton);

    await waitFor(() => {
      expect(logout).not.toHaveBeenCalled();
    });
  });

  it("renders Alerts link", () => {
    renderWithProviders(<UserInfo />);
    expect(screen.getByRole("link", { name: /alerts/i })).toBeInTheDocument();
  });

  it("renders version info", () => {
    renderWithProviders(<UserInfo />);
    const versionText = `v${APP_VERSION} (${APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"})`;
    expect(screen.getByText(versionText)).toBeInTheDocument();
  });

  it("renders the authenticated user name when user is set", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      authorized: true,
      user: authUser,
    });
    renderWithProviders(<UserInfo />);
    expect(screen.getByText(authUser.name)).toBeInTheDocument();
  });

  it("renders account link with aria-current=page when on account path", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      authorized: true,
      user: authUser,
    });
    renderWithProviders(<UserInfo />, {}, ROUTES.account.general());
    const accountLink = screen.getByRole("link", { name: authUser.name });
    expect(accountLink).toHaveAttribute("aria-current", "page");
  });

  it("renders alerts link with aria-current=page when on alerts path", () => {
    renderWithProviders(<UserInfo />, {}, ROUTES.alerts.root());
    const alertsLink = screen.getByRole("link", { name: /alerts/i });
    expect(alertsLink).toHaveAttribute("aria-current", "page");
  });

  describe("mobile accordion", () => {
    beforeEach(() => {
      // Mock matchMedia to simulate small screen (mobile)
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: (query: string) => ({
          matches: query.includes("max-width"),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }),
      });
    });

    it("renders accordion button on small screen", () => {
      renderWithProviders(<UserInfo />);
      const btn = screen.getByRole("button", {
        name: /unknown user/i,
      });
      expect(btn).toBeInTheDocument();
    });

    it("renders active account link when on account setting path in mobile view", () => {
      renderWithProviders(<UserInfo />, {}, ROUTES.account.general());
      const [generalLink] = screen.getAllByRole("link", { name: /general/i });
      expect(generalLink).toHaveAttribute("aria-current", "page");
    });

    it("expands account settings on click", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserInfo />);

      const btn = screen.getByRole("button", { name: /unknown user/i });
      expect(btn).toHaveAttribute("aria-expanded", "false");

      await user.click(btn);

      await waitFor(() => {
        expect(btn).toHaveAttribute("aria-expanded", "true");
      });
    });
  });
});
