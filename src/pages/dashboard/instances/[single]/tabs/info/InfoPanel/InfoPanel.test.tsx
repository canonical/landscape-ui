import { describe, expect, vi } from "vitest";
import InfoPanel from "./InfoPanel";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { instances } from "@/tests/mocks/instance";
import type { Instance } from "@/types/Instance";
import userEvent from "@testing-library/user-event";
import useAuth from "@/hooks/useAuth";
import type { AuthContextProps } from "@/context/auth";
import { authUser } from "@/tests/mocks/auth";
import type { FeatureKey } from "@/types/FeatureKey";
import { setScreenSize } from "@/tests/helpers";

const PROPS_TO_CHECK: (keyof Instance)[] = [
  "title",
  "hostname",
  "distribution",
  "access_group",
  "comment",
];

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
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue(authProps);
      renderWithProviders(<InfoPanel instance={instances[0]} />);
      setScreenSize("xxl");
    });

    it("should render instance info", () => {
      for (const prop of PROPS_TO_CHECK) {
        expect(screen.getByText(instances[0][prop] as string)).toBeVisible();
      }
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
    it("should render button if feature enabled", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...authProps,
        isFeatureEnabled: (feature: FeatureKey) =>
          feature === "employee-management",
      });

      renderWithProviders(<InfoPanel instance={instances[0]} />);

      const associateEmployeeButton = screen.queryByRole("button", {
        name: /associate employee/i,
      });

      expect(associateEmployeeButton).toBeInTheDocument();
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
