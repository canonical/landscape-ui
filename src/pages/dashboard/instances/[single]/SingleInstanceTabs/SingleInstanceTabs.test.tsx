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
import { screen } from "@testing-library/react";
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
        setAuthLoading: vi.fn(),
        setUser: vi.fn(),
        user: authUser,
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
});
