import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import { getTabLinks } from "./helpers";

vi.mock("@/hooks/useAuth");

const mockUseAuth = () => {
  vi.mocked(useAuth).mockReturnValue({
    authLoading: false,
    authorized: true,
    isFeatureEnabled: () => true,
    logout: vi.fn(),
    redirectToExternalUrl: vi.fn(),
    setUser: vi.fn(),
    user: authUser,
    safeRedirect: vi.fn(),
    hasAccounts: true,
  });
};

interface TabLabelProps {
  readonly packageCount?: number;
  readonly packagesLoading?: boolean;
  readonly usnCount?: number;
  readonly usnLoading?: boolean;
  readonly kernelCount?: number;
  readonly kernelLoading?: boolean;
  readonly healthScore?: number;
  readonly healthBand?: "critical" | "warning" | "healthy";
  readonly healthLoading?: boolean;
}

const TabLabelsConsumer: FC<TabLabelProps> = ({
  packageCount,
  packagesLoading = false,
  usnCount,
  usnLoading = false,
  kernelCount,
  kernelLoading = false,
  healthScore,
  healthBand,
  healthLoading = false,
}) => {
  const links = getTabLinks({
    activeTabId: "tab-link-packages",
    instance: ubuntuInstance,
    onActiveTabChange: vi.fn(),
    packageCount,
    packagesLoading,
    usnCount,
    usnLoading,
    kernelCount,
    kernelLoading,
    healthScore,
    healthBand,
    healthLoading,
  });

  return (
    <ul>
      {links.map((link) => (
        <li key={link.id}>{link.label}</li>
      ))}
    </ul>
  );
};

describe("getTabLinks helpers", () => {
  beforeEach(() => {
    mockUseAuth();
  });

  it("renders plain label when no count or loading", () => {
    renderWithProviders(<TabLabelsConsumer />);
    expect(screen.getByText("Packages")).toBeInTheDocument();
    expect(screen.getByText("Security issues")).toBeInTheDocument();
    expect(screen.getByText("Kernel")).toBeInTheDocument();
  });

  it("shows package badge when packageCount > 0", () => {
    renderWithProviders(<TabLabelsConsumer packageCount={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows usn badge when usnCount > 0", () => {
    renderWithProviders(<TabLabelsConsumer usnCount={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows kernel badge when kernelCount > 0", () => {
    renderWithProviders(<TabLabelsConsumer kernelCount={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows the health score chip with the band as its accessible name", () => {
    renderWithProviders(
      <TabLabelsConsumer healthScore={42} healthBand="warning" />,
    );
    const chip = screen.getByLabelText(/Health score 42/i);
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent("42");
  });

  it("shows loading spinner on the Health tab when healthLoading", () => {
    renderWithProviders(<TabLabelsConsumer healthLoading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows loading spinner when packagesLoading", () => {
    renderWithProviders(<TabLabelsConsumer packagesLoading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows loading spinner when usnLoading", () => {
    renderWithProviders(<TabLabelsConsumer usnLoading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows loading spinner when kernelLoading", () => {
    renderWithProviders(<TabLabelsConsumer kernelLoading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("returns tab links filtered to included tabs", () => {
    renderWithProviders(<TabLabelsConsumer />);
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Activities")).toBeInTheDocument();
  });

  it("marks active tab correctly", () => {
    const ActiveConsumer = () => {
      const links = getTabLinks({
        activeTabId: "tab-link-info",
        instance: ubuntuInstance,
        onActiveTabChange: vi.fn(),
        packageCount: undefined,
        packagesLoading: false,
        usnCount: undefined,
        usnLoading: false,
        kernelCount: undefined,
        kernelLoading: false,
        healthScore: undefined,
        healthBand: undefined,
        healthLoading: false,
      });
      return (
        <ul>
          {links.map((link) => (
            <li key={link.id} data-active={link.active ? "true" : "false"}>
              {link.id}
            </li>
          ))}
        </ul>
      );
    };
    renderWithProviders(<ActiveConsumer />);
    const infoItem = screen
      .getAllByRole("listitem")
      .find((el) => el.textContent === "tab-link-info");
    expect(infoItem).toHaveAttribute("data-active", "true");
  });
});
