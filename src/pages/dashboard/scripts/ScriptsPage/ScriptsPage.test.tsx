import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import ScriptsPage from "./ScriptsPage";

vi.mock("@/hooks/useAuth");

const mockAuth: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  hasAccounts: true,
};

describe("ScriptsPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("renders Scripts heading", () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<ScriptsPage />);

    expect(
      screen.getByRole("heading", { name: "Scripts" }),
    ).toBeInTheDocument();
  });

  it("shows notification about v2 scripts", () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<ScriptsPage />);

    expect(
      screen.getByText(/this page only displays v2 scripts/i),
    ).toBeInTheDocument();
  });

  it("dismisses the v2 scripts notification when clicking the dismiss button", async () => {
    vi.mocked(useAuth).mockReturnValue(mockAuth);

    renderWithProviders(<ScriptsPage />);

    const notification = screen.getByText(
      /this page only displays v2 scripts/i,
    );
    expect(notification).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", {
      name: /close notification/i,
    });
    await userEvent.click(dismissButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/this page only displays v2 scripts/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renders ScriptsTabs when script-profiles feature is enabled", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      isFeatureEnabled: vi.fn().mockReturnValue(true),
    });

    renderWithProviders(<ScriptsPage />);

    expect(
      screen.getByRole("heading", { name: "Scripts" }),
    ).toBeInTheDocument();
  });

  it("should trigger navigation to legacy portal when clicking the link", async () => {
    const assignSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      assign: assignSpy,
    });

    vi.mocked(useAuth).mockReturnValue(mockAuth);
    renderWithProviders(<ScriptsPage />);

    const legacyPortalButton = screen.getByRole("button", {
      name: /the legacy web portal/i,
    });
    await userEvent.click(legacyPortalButton);

    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith(
        expect.stringContaining("/scripts"),
      );
    });
  });
});
