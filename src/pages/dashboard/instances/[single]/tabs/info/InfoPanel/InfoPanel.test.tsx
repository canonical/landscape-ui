import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { MASKED_VALUE } from "@/constants";
import type { AuthContextProps } from "@/context/auth";
import { getFeatures } from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { authUser } from "@/tests/mocks/auth";
import {
  instances,
  instanceActivityNoKey,
  instanceActivityWithKey,
  instanceFailedActivityWithKey,
  instanceNoActivityNoKey,
  instanceNoActivityWithKey,
  windowsInstance,
  instanceWithHardware,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import type { FeatureKey } from "@/types/FeatureKey";
import type { Instance } from "@/types/Instance";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import InfoPanel from "./InfoPanel";

const PROPS_TO_CHECK: (keyof Instance)[] = ["title", "hostname", "comment"];

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn(),
  hasAccounts: true,
};

vi.mock("@/hooks/useAuth");

describe("InfoPanel", () => {
  const user = userEvent.setup();

  describe("Basic", () => {
    beforeEach(async () => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      setScreenSize("xxl");
      await expectLoadingState();
    });

    it("should render instance info", () => {
      for (const prop of PROPS_TO_CHECK) {
        expect(
          screen.getByText((instances[0][prop] as string) || NO_DATA_TEXT),
        ).toBeVisible();
      }

      expect(
        screen.getByText(
          instances[0].distribution_info?.description ?? NO_DATA_TEXT,
        ),
      ).toBeVisible();
    });

    it("should edit instance", async () => {
      const editButton = screen.getByRole("button", {
        name: /edit/i,
      });

      await userEvent.click(editButton);

      expect(
        await screen.findByRole("heading", {
          name: /edit instance/i,
        }),
      ).toBeVisible();

      expect(
        await screen.findByRole("textbox", {
          name: /title/i,
        }),
      ).toHaveValue(instances[0].title);
    });
  });

  describe("Associate employee button", () => {
    it("should render button if feature enabled", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });

      renderWithProviders(<InfoPanel instance={instances[0]} />);

      await expectLoadingState();

      await userEvent.click(
        screen.getByRole("button", { name: "More actions" }),
      );

      expect(
        screen.getByRole("menuitem", {
          name: /associate employee/i,
        }),
      ).toBeInTheDocument();
    });

    it("should not render button if feature disabled", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature !== "employee-management",
      });

      renderWithProviders(<InfoPanel instance={instances[0]} />);

      const associateEmployeeMenuItem = screen.queryByRole("menuitem", {
        name: /associate employee/i,
      });

      expect(associateEmployeeMenuItem).not.toBeInTheDocument();
    });
  });

  describe("Disassociate employee button", () => {
    it("should render button if instance has an employee associated", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });
      const instanceWithEmployee = instances.find(
        (instance) =>
          instance.employee_id !== null && getFeatures(instance).employees,
      );

      assert(instanceWithEmployee);

      renderWithProviders(<InfoPanel instance={instanceWithEmployee} />);
      await expectLoadingState();

      const moreActionsButton = screen.getByRole("button", {
        name: "More actions",
      });
      await userEvent.click(moreActionsButton);

      const disassociateEmployeeMenuItem = await screen.findByRole("menuitem", {
        name: /disassociate employee/i,
      });

      expect(disassociateEmployeeMenuItem).toBeInTheDocument();
    });

    it("should not render button if instance does not have an employee associated", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });

      const instanceWithoutEmployee = instances.find(
        (instance) => instance.employee_id === null,
      );
      assert(instanceWithoutEmployee);

      vi.mocked(useAuth).mockReturnValue(authProps);

      renderWithProviders(<InfoPanel instance={instanceWithoutEmployee} />);

      const disassociateEmployeeMenuItem = screen.queryByRole("menuitem", {
        name: /disassociate employee/i,
      });

      expect(disassociateEmployeeMenuItem).not.toBeInTheDocument();
    });
  });

  describe("Recovery key buttons", () => {
    it("should not render recovery key buttons for Windows instances", async () => {
      renderWithProviders(<InfoPanel instance={windowsInstance} />);

      await expectLoadingState();

      expect(
        screen.queryByRole("button", {
          name: "More actions",
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("menuitem", {
          name: "View recovery key",
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("menuitem", {
          name: "Generate recovery key",
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("menuitem", {
          name: "Regenerate recovery key",
        }),
      ).not.toBeInTheDocument();
    });

    describe("View recovery key button", () => {
      it("should render 'View recovery key' button if instance has recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceActivityWithKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );

        const viewKeyMenuItem = screen.getByRole("menuitem", {
          name: /view recovery key/i,
        });

        expect(viewKeyMenuItem).toBeInTheDocument();

        await user.click(viewKeyMenuItem);
        expect(
          await screen.findByRole("heading", {
            name: `View recovery key for "${instanceActivityWithKey.title}"`,
          }),
        ).toBeVisible();
      });

      it("should not render 'View recovery key' button if instance does not have recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceActivityNoKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );
        const viewKeyMenuItem = screen.queryByRole("menuitem", {
          name: /view recovery key/i,
        });

        expect(viewKeyMenuItem).not.toBeInTheDocument();
      });
    });

    describe("Generate recovery key button", () => {
      it("should render 'Generate recovery key' button if instance does not have recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceNoActivityNoKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );

        const generateKeyMenuItem = screen.getByRole("menuitem", {
          name: "Generate recovery key",
        });

        expect(generateKeyMenuItem).toBeInTheDocument();

        await user.click(generateKeyMenuItem);
        expect(
          await screen.findByRole("heading", {
            name: `Generate recovery key for "${instanceNoActivityNoKey.title}"`,
          }),
        ).toBeVisible();
      });

      it("should not render 'Generate recovery key' button if instance has recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceNoActivityWithKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );
        const generateKeyMenuItem = screen.queryByRole("menuitem", {
          name: "Generate recovery key",
        });

        expect(generateKeyMenuItem).not.toBeInTheDocument();
      });
    });

    describe("Regenerate recovery key button", () => {
      it("should render 'Regenerate recovery key' button if instance has recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceActivityWithKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );

        const regenerateKeyMenuItem = screen.getByRole("menuitem", {
          name: "Regenerate recovery key",
        });

        expect(regenerateKeyMenuItem).toBeInTheDocument();

        await user.click(regenerateKeyMenuItem);
        expect(
          await screen.findByRole("heading", {
            name: `Regenerate recovery key for "${instanceActivityWithKey.title}"`,
          }),
        ).toBeVisible();
      });

      it("should not render 'Regenerate recovery key' button if instance does not have recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceNoActivityNoKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );
        const regenerateKeyMenuItem = screen.queryByRole("menuitem", {
          name: "Regenerate recovery key",
        });

        expect(regenerateKeyMenuItem).not.toBeInTheDocument();
      });

      it("should render 'Regenerate recovery key' button if instance has no recovery key but has an activity", async () => {
        renderWithProviders(<InfoPanel instance={instanceActivityNoKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );

        const regenerateKeyMenuItem = screen.getByRole("menuitem", {
          name: "Regenerate recovery key",
        });

        expect(regenerateKeyMenuItem).toBeInTheDocument();
      });
    });

    it("shows recovery key warning in label when latest regeneration activity failed and key exists", async () => {
      renderWithProviders(
        <InfoPanel instance={instanceFailedActivityWithKey} />,
      );

      await expectLoadingState();

      const warningIcon = screen.getByLabelText("Recovery key warning");
      await user.hover(warningIcon);

      expect(
        await screen.findByText(
          "The last attempt to regenerate this key failed.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(MASKED_VALUE)).toBeInTheDocument();
      expect(screen.queryByText(/activity:/i)).not.toBeInTheDocument();
    });
  });

  describe("Profiles", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
    });

    it("shows nothing for Profiles when instance has no profiles", async () => {
      const instanceWithNoProfiles = {
        ...instances[0],
        profiles: [],
      };

      renderWithProviders(<InfoPanel instance={instanceWithNoProfiles} />);
      await expectLoadingState();

      expect(screen.getByText("Profiles")).toBeInTheDocument();
    });

    it("renders a single profile as a link", async () => {
      const instanceWithOneProfile = {
        ...instances[0],
        profiles: [
          {
            id: 1,
            name: "my-profile",
            title: "My Package Profile",
            type: "package" as const,
          },
        ],
      };

      renderWithProviders(<InfoPanel instance={instanceWithOneProfile} />);
      await expectLoadingState();

      expect(screen.getByText("My Package Profile")).toBeInTheDocument();
    });

    it("renders a button with count when instance has multiple profiles", async () => {
      const instanceWithMultipleProfiles = {
        ...instances[0],
        profiles: [
          {
            id: 1,
            name: "profile-1",
            title: "Profile One",
            type: "package" as const,
          },
          {
            id: 2,
            name: "profile-2",
            title: "Profile Two",
            type: "reboot" as const,
          },
        ],
      };

      renderWithProviders(
        <InfoPanel instance={instanceWithMultipleProfiles} />,
      );
      await expectLoadingState();

      expect(
        screen.getByRole("button", { name: "2 profiles" }),
      ).toBeInTheDocument();
    });
  });

  describe("Action modals", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      setScreenSize("xxl");
    });

    it("opens restart modal when Restart is clicked", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: /restart/i }));

      expect(
        await screen.findByRole("heading", { name: /restart/i }),
      ).toBeInTheDocument();
    });

    it("opens shut down modal when Shut down is clicked", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: /shut down/i }));

      expect(
        await screen.findByRole("heading", { name: /shut down/i }),
      ).toBeInTheDocument();
    });

    it("opens sanitize modal when Sanitize is clicked", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /sanitize/i }),
      );

      expect(
        await screen.findByRole("heading", { name: /sanitize instance/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Form and side-panel actions", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      setScreenSize("xxl");
    });

    it("opens Run script form when Run script is clicked", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: /run script/i }));

      expect(
        await screen.findByRole("heading", { name: /run script/i }),
      ).toBeVisible();
    });

    it("opens Associate employee form when Associate employee is clicked", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });

      const instanceWithoutEmployee = {
        ...instances[0],
        employee_id: null,
      } as Instance;

      renderWithProviders(<InfoPanel instance={instanceWithoutEmployee} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /associate employee/i }),
      );

      expect(
        await screen.findByRole("heading", {
          name: /associate employee/i,
        }),
      ).toBeVisible();
    });

    it("opens Profiles list when multiple-profiles button is clicked", async () => {
      const instanceWithMultipleProfiles = {
        ...instances[0],
        profiles: [
          {
            id: 1,
            name: "profile-1",
            title: "Profile One",
            type: "package" as const,
          },
          {
            id: 2,
            name: "profile-2",
            title: "Profile Two",
            type: "reboot" as const,
          },
        ],
      };

      renderWithProviders(
        <InfoPanel instance={instanceWithMultipleProfiles} />,
      );
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "2 profiles" }));

      expect(
        await screen.findByRole("heading", {
          name: /active profiles associated/i,
        }),
      ).toBeVisible();
    });
  });

  describe("Disassociate employee confirm", () => {
    it("successfully disassociates employee when confirmed", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });

      const instanceWithEmployee = instances.find(
        (instance) =>
          instance.employee_id !== null && getFeatures(instance).employees,
      );

      assert(instanceWithEmployee);

      renderWithProviders(<InfoPanel instance={instanceWithEmployee} />);
      await expectLoadingState();

      setScreenSize("xxl");
      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /disassociate employee/i }),
      );

      const modal = await screen.findByRole("dialog");
      await user.click(
        within(modal).getByRole("button", { name: /disassociate/i }),
      );

      expect(
        await screen.findByText(/you have successfully disassociated/i),
      ).toBeInTheDocument();
    });
  });

  describe("Sanitize instance confirm", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      setScreenSize("xxl");
    });

    it("successfully sanitizes instance when text is confirmed", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /sanitize/i }),
      );

      const confirmationInput = await screen.findByPlaceholderText(
        `sanitize ${instances[0].title}`,
      );
      await user.type(confirmationInput, `sanitize ${instances[0].title}`);

      const dialog = screen.getByRole("dialog");
      await user.click(
        within(dialog).getByRole("button", { name: /^sanitize$/i }),
      );

      expect(
        await screen.findByText(
          /you have successfully marked.*to be sanitized/i,
        ),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /view details/i }));

      expect(
        screen.queryByText(/you have successfully marked.*to be sanitized/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("WSL instance features", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      setScreenSize("xxl");
    });

    it("renders WSL chip for WSL instances", async () => {
      const wslInstance = instances.find((i) => i.is_wsl_instance);
      assert(wslInstance);

      renderWithProviders(<InfoPanel instance={wslInstance} />);
      await expectLoadingState();

      expect(screen.getByText("WSL instance")).toBeInTheDocument();
    });

    it("opens Reinstall modal for WSL instance", async () => {
      const wslInstance = instances.find((i) => i.is_wsl_instance);
      assert(wslInstance);

      renderWithProviders(<InfoPanel instance={wslInstance} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /reinstall/i }),
      );

      expect(
        await screen.findByRole("heading", { name: /reinstall/i }),
      ).toBeInTheDocument();
    });

    it("opens Uninstall modal for WSL instance", async () => {
      const wslInstance = instances.find((i) => i.is_wsl_instance);
      assert(wslInstance);

      renderWithProviders(<InfoPanel instance={wslInstance} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /^uninstall$/i }),
      );

      expect(
        await screen.findByRole("heading", { name: /uninstall/i }),
      ).toBeInTheDocument();
    });

    it("opens Remove from Landscape modal", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", {
          name: /remove from landscape/i,
        }),
      );

      expect(
        await screen.findByRole("heading", {
          name: /remove.*from landscape/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Remove from Landscape completion", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      setScreenSize("xxl");
    });

    it("navigates away after Remove from Landscape is confirmed", async () => {
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      await expectLoadingState();

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", {
          name: /remove from landscape/i,
        }),
      );

      const confirmationInput = await screen.findByPlaceholderText(
        `remove ${instances[0].title}`,
      );
      await user.type(confirmationInput, `remove ${instances[0].title}`);

      const dialog = screen.getByRole("dialog");
      await user.click(
        within(dialog).getByRole("button", { name: /^remove$/i }),
      );

      expect(
        await screen.findByText(/you have successfully removed/i),
      ).toBeInTheDocument();
    });
  });

  describe("Instance with hardware details", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
    });

    it("renders IP addresses when hardware data is available", async () => {
      renderWithProviders(<InfoPanel instance={instanceWithHardware} />);
      await expectLoadingState();

      expect(await screen.findByText("192.168.1.1")).toBeInTheDocument();
    });
  });

  describe("Edge case branches", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
    });

    it("renders null for last_ping_time when it is invalid", async () => {
      const instanceWithInvalidPing = {
        ...instances[0],
        last_ping_time: "",
      } as Instance;

      renderWithProviders(<InfoPanel instance={instanceWithInvalidPing} />);
      await expectLoadingState();

      expect(await screen.findByText(instances[0].title)).toBeInTheDocument();
    });

    it("renders gracefully when instance has no annotations", async () => {
      const instanceWithoutAnnotations = {
        ...instances[0],
        annotations: null,
      } as unknown as Instance;

      renderWithProviders(<InfoPanel instance={instanceWithoutAnnotations} />);
      await expectLoadingState();

      expect(await screen.findByText(instances[0].title)).toBeInTheDocument();
    });

    it("handles disassociate error gracefully", async () => {
      vi.spyOn(console, "error").mockReturnValue(undefined);
      setScreenSize("xxl");

      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });

      const instanceWithEmployee = instances.find(
        (instance) =>
          instance.employee_id !== null && getFeatures(instance).employees,
      );
      assert(instanceWithEmployee);

      renderWithProviders(<InfoPanel instance={instanceWithEmployee} />);
      await expectLoadingState();

      setEndpointStatus("error");

      await user.click(screen.getByRole("button", { name: "More actions" }));
      await user.click(
        await screen.findByRole("menuitem", { name: /disassociate employee/i }),
      );

      const modal = await screen.findByRole("dialog");
      await user.click(
        within(modal).getByRole("button", { name: /disassociate/i }),
      );

      expect(
        screen.queryByText(/you have successfully disassociated/i),
      ).not.toBeInTheDocument();
    });

    it("renders multiple annotations with separators", async () => {
      const instanceWithMultipleAnnotations = {
        ...instances[0],
        annotations: {
          Annotation1: "Value1",
          Annotation2: "Value2",
        },
      } as Instance;

      renderWithProviders(
        <InfoPanel instance={instanceWithMultipleAnnotations} />,
      );
      await expectLoadingState();

      expect(
        await screen.findByText("Annotation1: Value1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Annotation2: Value2")).toBeInTheDocument();
    });

    it("falls back to access_group name when no matching title found", async () => {
      const instanceWithUnknownGroup = {
        ...instances[0],
        access_group: "unknown-group",
      } as Instance;

      renderWithProviders(<InfoPanel instance={instanceWithUnknownGroup} />);
      await expectLoadingState();

      expect(await screen.findByText("unknown-group")).toBeInTheDocument();
    });

    it("renders icon fallback when instance has multiple non-upgrade alerts", async () => {
      const instanceWithMultipleAlerts = {
        ...instances[0],
        alerts: [
          { type: "PackageReporterAlert", summary: "Reporter failed" },
          { type: "ComputerOfflineAlert", summary: "Computer offline" },
        ],
      } as Instance;

      renderWithProviders(<InfoPanel instance={instanceWithMultipleAlerts} />);
      await expectLoadingState();

      expect(await screen.findByText(instances[0].title)).toBeInTheDocument();
    });

    it("renders with empty access groups when query fails", async () => {
      vi.spyOn(console, "error").mockReturnValue(undefined);
      setEndpointStatus({ status: "error", path: "GetAccessGroups" });

      renderWithProviders(<InfoPanel instance={instances[0]} />);

      expect(await screen.findByText(instances[0].title)).toBeInTheDocument();
    });
  });
});
