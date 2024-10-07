import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AlertsList from "./AlertsList";
import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import useAuth from "@/hooks/useAuth";
import { useMediaQuery } from "usehooks-ts";
import { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";

vi.mock("@/hooks/useAuth");
vi.mock("usehooks-ts", () => ({
  useMediaQuery: vi.fn(),
}));

const mockAvailableTagOptions = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
];

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  account: { switchable: false },
  updateUser: vi.fn(),
  user: authUser,
  isOidcAvailable: true,
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
      user: { ...authUser, current_account: "non-existent" },
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
