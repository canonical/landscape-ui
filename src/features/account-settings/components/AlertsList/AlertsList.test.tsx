import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AlertsList from "./AlertsList";
import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import useAuth from "@/hooks/useAuth";
import { useMediaQuery } from "usehooks-ts";
import { AuthContextProps, AuthUser } from "@/context/auth";

vi.mock("@/hooks/useAuth");
vi.mock("usehooks-ts", () => ({
  useMediaQuery: vi.fn(),
}));

const mockAvailableTagOptions = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
];

const mockUser: AuthUser = {
  accounts: [{ name: "test-account", title: "Test Account" }],
  current_account: "test-account",
  email: "example@mail.com",
  name: "Test User",
  token: "test-token",
};

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  switchAccount: vi.fn(),
  updateUser: vi.fn(),
  user: mockUser,
};

describe("AlertsList", () => {
  beforeEach(() => {
    vi.mocked(useMediaQuery).mockReset();
    vi.mocked(useAuth).mockReturnValue(authProps);
  });

  it("renders the component with correct title", () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

    renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    expect(screen.getByText("Test Account")).toBeInTheDocument();
  });

  it("renders AlertsTable component", () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

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
      user: { ...mockUser, current_account: "non-existent" },
    });
    vi.mocked(useMediaQuery).mockReturnValue(true);

    renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    expect(screen.getByText("Alerts")).toBeInTheDocument();
  });

  it("renders correctly when there are no alerts", () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);

    renderWithProviders(
      <AlertsList alerts={[]} availableTagOptions={mockAvailableTagOptions} />,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders mobile view when screen is small", () => {
    vi.mocked(useMediaQuery).mockReturnValue(false);

    const { container } = renderWithProviders(
      <AlertsList
        alerts={alerts}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const table = container.querySelector("table");
    expect(table).toBeNull();

    alerts.forEach((alert) => {
      expect(screen.getByText(alert.label)).toBeInTheDocument();
      expect(screen.getByText(alert.description)).toBeInTheDocument();
    });
  });
});
