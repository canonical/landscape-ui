import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";
import {
  debianInstance,
  ubuntuCoreInstance,
  ubuntuInstance,
  windowsInstance,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import type { Instance } from "@/types/Instance";
import type { FeatureKey } from "@/types/FeatureKey";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import SingleInstanceTabs from "./SingleInstanceTabs";

vi.mock("@/hooks/useAuth");

const mockUseAuth = (
  isFeatureEnabled: (feature: FeatureKey) => boolean = () => true,
) => {
  vi.mocked(useAuth).mockReturnValue({
    authLoading: false,
    authorized: true,
    isFeatureEnabled,
    logout: vi.fn(),
    redirectToExternalUrl: vi.fn(),
    setUser: vi.fn(),
    user: authUser,
    safeRedirect: vi.fn(),
    hasAccounts: true,
    isSuperAdmin: false,
    canManageAccounts: false,
    canEnterAccounts: false,
  });
};

const validateTabs = (instance: Instance, tabNames: string[]) => {
  renderWithProviders(
    <SingleInstanceTabs
      instance={instance}
      kernelCount={0}
      kernelLoading={false}
      packageCount={0}
      packagesLoading={false}
      usnCount={0}
      usnLoading={false}
    />,
  );

  const tabs = within(
    screen.getByRole("navigation", { name: "Instance details" }),
  ).getAllByRole("link");

  expect(tabs).toHaveLength(tabNames.length);
  for (const index in tabs) {
    assert(tabNames[index] !== undefined);
    expect(tabs[index]).toHaveTextContent(tabNames[index]);
  }
};

describe("SingleInstanceTabs", () => {
  describe("getTabLinks", () => {
    beforeEach(() => {
      mockUseAuth();
    });

    it("should use the correct tabs for ubuntu", () => {
      validateTabs(ubuntuInstance, [
        "Info",
        "Activities",
        "Kernel",
        "Security issues",
        "Packages",
        "Snaps",
        "Processes",
        "Ubuntu Pro",
        "Users",
        "Hardware",
      ]);
    });

    it("should use the correct tabs for ubuntu core", () => {
      validateTabs(ubuntuCoreInstance, [
        "Info",
        "Activities",
        "Snaps",
        "Processes",
        "Ubuntu Pro",
        "Hardware",
      ]);
    });

    it("should use the correct tabs for windows", () => {
      validateTabs(windowsInstance, [
        "Info",
        "WSL",
        "Activities",
        "Ubuntu Pro",
      ]);
    });

    it("hides the WSL tab when the feature is disabled", () => {
      mockUseAuth((feature) => feature !== "wsl-child-instance-profiles");

      validateTabs(windowsInstance, ["Info", "Activities", "Ubuntu Pro"]);
    });

    it("should use the correct tabs for other linux", () => {
      validateTabs(debianInstance, [
        "Info",
        "Activities",
        "Snaps",
        "Processes",
        "Users",
        "Hardware",
      ]);
    });
  });

  describe("tab state and badges", () => {
    beforeEach(() => {
      mockUseAuth();
    });

    it("renders the Info tab as active by default", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={false}
          packageCount={0}
          packagesLoading={false}
          usnCount={0}
          usnLoading={false}
        />,
      );

      const allTabs = screen.getAllByRole("link");
      expect(allTabs[0]).toHaveTextContent("Info");
      expect(allTabs[0]).toHaveAttribute("aria-current", "page");
    });

    it("shows package badge count on Packages tab when packageCount > 0", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={false}
          packageCount={7}
          packagesLoading={false}
          usnCount={0}
          usnLoading={false}
        />,
      );

      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("shows loading spinner on Packages tab when packagesLoading=true", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={false}
          packageCount={undefined}
          packagesLoading={true}
          usnCount={0}
          usnLoading={false}
        />,
      );

      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("shows security issues badge count when usnCount > 0", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={false}
          packageCount={0}
          packagesLoading={false}
          usnCount={3}
          usnLoading={false}
        />,
      );

      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("shows kernel badge count when kernelCount > 0", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={5}
          kernelLoading={false}
          packageCount={0}
          packagesLoading={false}
          usnCount={0}
          usnLoading={false}
        />,
      );

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("shows loading spinner on Security Issues tab when usnLoading=true", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={false}
          packageCount={0}
          packagesLoading={false}
          usnCount={undefined}
          usnLoading={true}
        />,
      );

      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("shows loading spinner on Kernel tab when kernelLoading=true", () => {
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={true}
          packageCount={0}
          packagesLoading={false}
          usnCount={0}
          usnLoading={false}
        />,
      );

      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("clicking a tab marks it as the current page", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SingleInstanceTabs
          instance={ubuntuInstance}
          kernelCount={0}
          kernelLoading={false}
          packageCount={0}
          packagesLoading={false}
          usnCount={0}
          usnLoading={false}
        />,
      );

      await user.click(screen.getByRole("link", { name: /activities/i }));

      expect(screen.getByRole("link", { name: /activities/i })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });

  describe("tab panels rendering", () => {
    const defaultProps = {
      kernelCount: 0,
      kernelLoading: false,
      packageCount: 0,
      packagesLoading: false,
      usnCount: 0,
      usnLoading: false,
    };

    beforeEach(() => {
      mockUseAuth();
    });

    it("renders PackagesPanel when packages tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=packages",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /packages/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("renders KernelPanel when kernel tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=kernel",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /^kernel/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("renders SecurityIssuesPanel when security-issues tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=security-issues",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /security issues/i }),
        ).toHaveAttribute("aria-current", "page");
      });
    });

    it("renders SnapsPanel when snaps tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=snaps",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /snaps/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("renders ProcessesPanel when processes tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=processes",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /processes/i }),
        ).toHaveAttribute("aria-current", "page");
      });
    });

    it("renders UbuntuProPanel when ubuntu-pro tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=ubuntu-pro",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /ubuntu pro/i }),
        ).toHaveAttribute("aria-current", "page");
      });
    });

    it("renders UserPanel when users tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=users",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /users/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("renders HardwarePanel when hardware tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=hardware",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /hardware/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("renders WslPanel when wsl tab is active for Windows instance", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={windowsInstance} {...defaultProps} />,
        undefined,
        "/computers/6?tab=wsl",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("link", { name: /wsl/i })).toHaveAttribute(
          "aria-current",
          "page",
        );
      });
    });

    it("navigates to the tab's URL when a tab is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1",
        "/computers/:instanceId",
      );

      const kernelTab = screen.getByRole("link", { name: /^kernel/i });
      expect(kernelTab).toHaveAttribute("href", "/computers/1?tab=kernel");

      await user.click(kernelTab);

      expect(screen.getByRole("link", { name: /^kernel/i })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });
});
