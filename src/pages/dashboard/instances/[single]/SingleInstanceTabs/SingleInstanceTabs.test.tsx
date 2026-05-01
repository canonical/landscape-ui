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
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import SingleInstanceTabs from "./SingleInstanceTabs";

vi.mock("@/hooks/useAuth");

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

  const tabs = screen.getByRole("list");

  for (const index in [...tabs.childNodes]) {
    assert(tabNames[index] !== undefined);
    expect(tabs.childNodes[index]).toHaveTextContent(tabNames[index]);
  }
};

describe("SingleInstanceTabs", () => {
  describe("getTabLinks", () => {
    beforeEach(() => {
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

      const allTabs = screen.getAllByRole("tab");
      expect(allTabs[0]).toHaveAttribute("aria-selected", "true");
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

    it("clicking a tab sets that tab's aria-selected to true", async () => {
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

      const activitiesTab = screen.getByRole("tab", { name: /activities/i });
      await user.click(activitiesTab);

      expect(activitiesTab).toHaveAttribute("aria-selected", "true");
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
    });

    it("renders PackagesPanel when packages tab is active", async () => {
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1?tab=packages",
        "/computers/:instanceId",
      );
      await waitFor(() => {
        expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
          "aria-selected",
          "true",
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
        expect(screen.getByRole("tab", { name: /^kernel/i })).toHaveAttribute(
          "aria-selected",
          "true",
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
          screen.getByRole("tab", { name: /security issues/i }),
        ).toHaveAttribute("aria-selected", "true");
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
        expect(screen.getByRole("tab", { name: /snaps/i })).toHaveAttribute(
          "aria-selected",
          "true",
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
        expect(screen.getByRole("tab", { name: /processes/i })).toHaveAttribute(
          "aria-selected",
          "true",
        );
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
          screen.getByRole("tab", { name: /ubuntu pro/i }),
        ).toHaveAttribute("aria-selected", "true");
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
        expect(screen.getByRole("tab", { name: /users/i })).toHaveAttribute(
          "aria-selected",
          "true",
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
        expect(screen.getByRole("tab", { name: /hardware/i })).toHaveAttribute(
          "aria-selected",
          "true",
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
        expect(screen.getByRole("tab", { name: /wsl/i })).toHaveAttribute(
          "aria-selected",
          "true",
        );
      });
    });

    it("calls closeSidePanel and setPageParams when a tab is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SingleInstanceTabs instance={ubuntuInstance} {...defaultProps} />,
        undefined,
        "/computers/1",
        "/computers/:instanceId",
      );

      const kernelTab = screen.getByRole("tab", { name: /^kernel/i });
      await user.click(kernelTab);

      expect(kernelTab).toHaveAttribute("aria-selected", "true");
    });
  });
});
