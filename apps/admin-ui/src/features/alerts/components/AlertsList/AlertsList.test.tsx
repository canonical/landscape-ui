import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertsList from "./AlertsList";
import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import useAuth from "@/hooks/useAuth";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";

vi.mock("@/hooks/useAuth");

const mockAvailableTagOptions = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
];

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setAuthLoading: vi.fn(),
  setUser: vi.fn(),
  user: authUser,
  isOidcAvailable: true,
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn(),
};

describe("AlertsList", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authProps);
  });
  afterEach(() => {
    resetScreenSize();
  });

  it("renders the component with correct title", () => {
    renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    expect(screen.getByText("Test Account")).toBeInTheDocument();
  });

  it("renders AlertsTable component", () => {
    setScreenSize("lg");

    renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("displays default title when user account is not found", () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authProps,
      user: { ...authUser, current_account: "non-existent" },
    });
    setScreenSize("lg");

    renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    expect(screen.getByText("Alerts")).toBeInTheDocument();
  });

  it("renders correctly when there are no alerts", () => {
    setScreenSize("lg");

    renderWithProviders(
      <AlertsList alerts={[]} availableTagOptions={mockAvailableTagOptions} />,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders mobile view when screen is small", () => {
    setScreenSize("xs");

    renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();

    alerts.forEach((alert) => {
      expect(screen.getByText(alert.label)).toBeInTheDocument();
      expect(screen.getByText(alert.description)).toBeInTheDocument();
    });
  });
});
