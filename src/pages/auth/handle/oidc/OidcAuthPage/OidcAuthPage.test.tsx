import { beforeEach, describe, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { AuthStateResponse } from "@/features/auth";
import { authUser } from "@/tests/mocks/auth";

const redirectToExternalUrl = vi.fn();
const navigate = vi.fn();

const mockTestParams = (response: AuthStateResponse | Error) => {
  vi.doMock("react-router", async () => ({
    ...(await vi.importActual("react-router")),
    useSearchParams: () => [new URLSearchParams({ enabled: "true" })],
    useNavigate: () => navigate,
  }));

  vi.doMock("@/features/auth", () => ({
    useUnsigned: () => ({
      getAuthStateWithOidcQuery: () =>
        response instanceof Error
          ? {
              data: undefined,
              error: response,
              isLoading: false,
            }
          : {
              data: { data: response },
              error: null,
              isLoading: false,
            },
    }),
  }));

  vi.doMock("@/hooks/useAuth", async () => ({
    default: () => ({
      setAuthLoading: vi.fn(),
      setUser: vi.fn(),
      redirectToExternalUrl,
    }),
  }));
};

describe("OidcAuthPage", () => {
  it("should render error message when there is no search params", async () => {
    const { default: Component } = await import("./OidcAuthPage");

    renderWithProviders(<Component />);

    expect(
      screen.getByText("Please wait while your request is being processed..."),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        "Oops! Something went wrong. Please try again or contact our support team.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Back to login" }),
    ).toBeInTheDocument();
  });

  describe("with additional test params", () => {
    const responsesToMock: (AuthStateResponse | Error)[] = [
      new Error("Test error"),
      {
        ...authUser,
        return_to: {
          external: true,
          url: "https://example.com",
        },
      },
      {
        ...authUser,
        return_to: {
          external: false,
          url: "/dashboard",
        },
      },
      {
        ...authUser,
        return_to: null,
      },
    ];

    beforeEach(async ({ task: { id } }) => {
      vi.doUnmock("react-router");
      vi.doUnmock("@/features/auth");
      vi.doUnmock("@/hooks/useAuth");
      vi.resetModules();

      const taskId = Number(id.substring(id.length - 1));

      mockTestParams(responsesToMock[taskId]);

      const { default: Component } = await import("./OidcAuthPage");

      renderWithProviders(<Component />);
    });

    it("should render error message when an error occurs", async () => {
      expect(
        screen.getByText(
          "Oops! Something went wrong. Please try again or contact our support team.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: "Back to login" }),
      ).toBeInTheDocument();
    });

    it("should redirect to external URL when return_to is external", async () => {
      expect(redirectToExternalUrl).toHaveBeenCalledWith(
        "https://example.com",
        { replace: true },
      );
    });

    it("should redirect to internal URL when return_to is not external", async () => {
      expect(navigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });

    it("should redirect to internal URL when return_to is not provided", async () => {
      expect(navigate).toHaveBeenCalledWith(
        new URL("/overview", location.origin).pathname,
        { replace: true },
      );
    });
  });
});
