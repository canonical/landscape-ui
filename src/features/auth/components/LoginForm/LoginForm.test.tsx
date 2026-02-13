import { HOMEPAGE_PATH } from "@/constants";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, vi } from "vitest";

const user = {
  email: "john@example.com",
  password: "123456789",
};

const navigate = vi.fn();
const safeRedirect = vi.fn();
const setUser = vi.fn();

const loginSpy = vi.fn().mockResolvedValue({ data: authUser });

const mockTestParams = (searchParams?: Record<string, string>) => {
  vi.doMock("react-router", async () => ({
    ...(await vi.importActual("react-router")),
    useSearchParams: () => [new URLSearchParams(searchParams)],
    useNavigate: () => navigate,
  }));

  vi.doMock("@/hooks/useAuth", () => ({
    default: () => ({
      safeRedirect,
      setUser,
    }),
  }));

  vi.doMock("@/features/auth", async () => {
    const actual = await vi.importActual("@/features/auth");
    return {
      ...actual,
      useLogin: () => ({
        login: loginSpy,
        isLoggingIn: false,
        error: null,
      }),
    };
  });
};

describe("LoginForm", () => {
  describe("without additional test params", () => {
    beforeEach(async ({ task: { id } }) => {
      vi.doUnmock("react-router");
      vi.doUnmock("@/hooks/useAuth");
      vi.resetModules();
      vi.clearAllMocks();

      const taskId = Number(id.substring(id.length - 1));

      if (taskId === 0) {
        loginSpy.mockRejectedValueOnce(new Error("Invalid credentials"));
      } else {
        loginSpy.mockResolvedValue({ data: authUser });
      }

      mockTestParams();

      const { default: Component } = await import("./LoginForm");

      renderWithProviders(<Component isIdentityAvailable={false} />);

      await userEvent.type(
        screen.getByTestId("email"),
        taskId > 0 ? user.email : user.email.slice(1),
      );

      await userEvent.type(screen.getByTestId("password"), user.password);

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    });

    it("should not sign in", async () => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: user.email.slice(1),
        password: user.password,
      });

      expect(navigate).not.toHaveBeenCalled();
      expect(safeRedirect).not.toHaveBeenCalled();
    });

    it("should sign in and redirect to default url", async () => {
      expect(loginSpy).toHaveBeenCalledWith(user);
      expect(setUser).toHaveBeenCalledWith(authUser);
      expect(safeRedirect).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        external: false,
        replace: true,
      });
    });
  });

  describe("with additional test params", () => {
    const testSearchParams = [
      { "redirect-to": "/dashboard" },
      {
        external: "true",
        "redirect-to": "https://example.com",
      },
      { external: "true" },
    ] as const;

    beforeEach(async ({ task: { id } }) => {
      vi.doUnmock("react-router");
      vi.doUnmock("@/hooks/useAuth");
      vi.resetModules();
      vi.clearAllMocks();

      loginSpy.mockResolvedValue({ data: authUser });

      const taskId = Number(id.substring(id.length - 1));

      mockTestParams(testSearchParams[taskId]);

      const { default: Component } = await import("./LoginForm");

      renderWithProviders(<Component isIdentityAvailable={false} />);

      await userEvent.type(screen.getByTestId("email"), user.email);

      await userEvent.type(screen.getByTestId("password"), user.password);

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      expect(loginSpy).toHaveBeenCalledWith(user);
    });

    it("should sign in and redirect to provided url", async () => {
      expect(setUser).toHaveBeenCalledWith(authUser);
      expect(safeRedirect).toHaveBeenCalledWith(
        testSearchParams[0]["redirect-to"],
        {
          external: false,
          replace: true,
        },
      );
    });

    it("should sign in and request external redirect", async () => {
      expect(setUser).toHaveBeenCalledWith(authUser);
      expect(safeRedirect).toHaveBeenCalledWith(
        testSearchParams[1]["redirect-to"],
        {
          external: true,
          replace: true,
        },
      );
    });

    it("should sign in and redirect to default url", async () => {
      expect(safeRedirect).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        external: true,
        replace: true,
      });
    });
  });
});
