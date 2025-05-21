import { beforeEach, describe, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import { authUser } from "@/tests/mocks/auth";
import { ROUTES } from "@/libs/routes";

const user = {
  email: "john@example.com",
  password: "123456789",
};

const navigate = vi.fn();
const redirectToExternalUrl = vi.fn();
const setAuthLoading = vi.fn();
const setUser = vi.fn();
const signInWithEmailAndPassword = vi
  .fn()
  .mockResolvedValue({ data: authUser })
  .mockRejectedValueOnce(new Error("Invalid credentials"));

const mockTestParams = (searchParams?: Record<string, string>) => {
  vi.doMock("react-router", async () => ({
    ...(await vi.importActual("react-router")),
    useSearchParams: () => [new URLSearchParams(searchParams)],
    useNavigate: () => navigate,
  }));

  vi.doMock("@/hooks/useAuth", () => ({
    default: () => ({
      redirectToExternalUrl,
      setAuthLoading,
      setUser,
    }),
  }));

  vi.doMock("../../hooks", () => ({
    useUnsigned: () => ({
      signInWithEmailAndPasswordQuery: {
        mutateAsync: signInWithEmailAndPassword,
      },
    }),
  }));
};

describe("LoginForm", () => {
  describe("without additional test params", () => {
    beforeEach(async ({ task: { id } }) => {
      vi.doUnmock("react-router");
      vi.doUnmock("@/hooks/useAuth");
      vi.resetModules();

      const taskId = Number(id.substring(id.length - 1));

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
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({
        email: user.email.slice(1),
        password: user.password,
      });

      expect(navigate).not.toHaveBeenCalled();
      expect(redirectToExternalUrl).not.toHaveBeenCalled();
    });

    it("should sign in and redirect to default url", async () => {
      expect(navigate).toHaveBeenCalledWith(
        new URL(ROUTES.overview(), location.origin).pathname,
        { replace: true },
      );

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(user);
      expect(setAuthLoading).toHaveBeenCalledWith(true);
      expect(setUser).toHaveBeenCalledWith(authUser);
    });
  });

  describe("with additional test params", () => {
    const testSearchParams: Record<string, string>[] = [
      { "redirect-to": "/dashboard" },
      {
        external: "true",
        "redirect-to": "https://example.com",
      },
      { external: "true" },
    ];

    beforeEach(async ({ task: { id } }) => {
      vi.doUnmock("react-router");
      vi.doUnmock("@/hooks/useAuth");
      vi.resetModules();

      const taskId = Number(id.substring(id.length - 1));

      mockTestParams(testSearchParams[taskId]);

      const { default: Component } = await import("./LoginForm");

      renderWithProviders(<Component isIdentityAvailable={false} />);

      await userEvent.type(
        screen.getByTestId("email"),
        taskId > 0 ? user.email : user.email.slice(1),
      );

      await userEvent.type(screen.getByTestId("password"), user.password);

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(user);
      expect(setAuthLoading).toHaveBeenCalledWith(true);
      expect(setUser).toHaveBeenCalledWith(authUser);
    });

    it("should sign in and redirect to provided url", async () => {
      expect(navigate).toHaveBeenCalledWith(
        testSearchParams[0]["redirect-to"],
        { replace: true },
      );
    });

    it("should sign in and redirect to provided url", async () => {
      expect(redirectToExternalUrl).toHaveBeenCalledWith(
        testSearchParams[1]["redirect-to"],
        { replace: true },
      );
    });

    it("should sign in and redirect to default url", async () => {
      expect(navigate).toHaveBeenCalledWith(
        new URL(ROUTES.overview(), location.origin).pathname,
        { replace: true },
      );
    });
  });
});
