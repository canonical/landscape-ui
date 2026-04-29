import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { MASKED_VALUE } from "@/constants";
import type { AuthContextProps } from "@/context/auth";
import { getFeatures } from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { authUser } from "@/tests/mocks/auth";
import {
  instances,
  instanceActivityNoKey,
  instanceActivityWithKey,
  instanceFailedActivityWithKey,
  instanceNoActivityNoKey,
  instanceNoActivityWithKey,
  windowsInstance,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import type { FeatureKey } from "@/types/FeatureKey";
import type { Instance } from "@/types/Instance";
import { screen } from "@testing-library/react";
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
});
