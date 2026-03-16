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
        screen.getByRole("button", {
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

      const associateEmployeeButton = screen.queryByRole("button", {
        name: /associate employee/i,
      });

      expect(associateEmployeeButton).not.toBeInTheDocument();
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

      const disassociateEmployeeButton = await screen.findByRole("button", {
        name: /disassociate employee/i,
      });

      expect(disassociateEmployeeButton).toBeInTheDocument();
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

      const disassociateEmployeeButton = screen.queryByRole("button", {
        name: /disassociate employee/i,
      });

      expect(disassociateEmployeeButton).not.toBeInTheDocument();
    });
  });

  describe("Recovery key buttons", () => {
    describe("View recovery key button", () => {
      it("should render 'View recovery key' button if instance has recovery key", async () => {
        renderWithProviders(<InfoPanel instance={instanceActivityWithKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );

        const viewKeyButton = screen.getByRole("button", {
          name: /view recovery key/i,
        });

        expect(viewKeyButton).toBeInTheDocument();

        await user.click(viewKeyButton);
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
        const viewKeyButton = screen.queryByRole("button", {
          name: /view recovery key/i,
        });

        expect(viewKeyButton).not.toBeInTheDocument();
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

        const generateKeyButton = screen.getByRole("button", {
          name: "Generate recovery key",
        });

        expect(generateKeyButton).toBeInTheDocument();

        await user.click(generateKeyButton);
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
        const generateKeyButton = screen.queryByRole("button", {
          name: "Generate recovery key",
        });

        expect(generateKeyButton).not.toBeInTheDocument();
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

        const regenerateKeyButton = screen.getByRole("button", {
          name: "Regenerate recovery key",
        });

        expect(regenerateKeyButton).toBeInTheDocument();

        await user.click(regenerateKeyButton);
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
        const regenerateKeyButton = screen.queryByRole("button", {
          name: "Regenerate recovery key",
        });

        expect(regenerateKeyButton).not.toBeInTheDocument();
      });

      it("should render 'Regenerate recovery key' button if instance has no recovery key but has an activity", async () => {
        renderWithProviders(<InfoPanel instance={instanceActivityNoKey} />);

        await expectLoadingState();
        await user.click(
          screen.getByRole("button", {
            name: "More actions",
          }),
        );

        const regenerateKeyButton = screen.getByRole("button", {
          name: "Regenerate recovery key",
        });

        expect(regenerateKeyButton).toBeInTheDocument();
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
