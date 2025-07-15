import { NO_DATA_TEXT } from "@/components/layout/NoData";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { authUser } from "@/tests/mocks/auth";
import { instances } from "@/tests/mocks/instance";
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
  setAuthLoading: vi.fn(),
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn(),
};

vi.mock("@/hooks/useAuth");

describe("InfoPanel", () => {
  describe("Basic", () => {
    beforeEach(async () => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      setScreenSize("xxl");
      await expectLoadingState();
    });

    it("should render instance info", async () => {
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
});
