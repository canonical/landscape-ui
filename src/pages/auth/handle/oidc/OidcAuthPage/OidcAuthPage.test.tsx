import { beforeEach, describe, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { AuthStateResponse } from "@/features/auth";
import { authUser } from "@/tests/mocks/auth";
import { HOMEPAGE_PATH } from "@/constants";
import type { EnvContextState } from "@/context/env";
import useEnv from "@/hooks/useEnv";

const redirectToExternalUrl = vi.fn();
const navigate = vi.fn();
const setUser = vi.fn();

vi.mock("@/hooks/useEnv");

const mockSelfHosted: EnvContextState = {
  envLoading: false,
  isSaas: false,
  isSelfHosted: true,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

const mockSaas: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

vi.mocked(useEnv).mockReturnValue(mockSaas);

const mockTestParams = (response: AuthStateResponse | Error) => {
  vi.doMock("react-router", async () => ({
    ...(await vi.importActual("react-router")),
    useSearchParams: () => [
      new URLSearchParams({
        enabled: "true",
        code: "mock-code",
        state: "mock-state",
      }),
    ],
    useNavigate: () => navigate,
  }));

  vi.doMock("@/features/auth", async () => {
    const actual = await vi.importActual("@/features/auth");
    return {
      ...actual,
      useGetOidcAuth: () => {
        if (response instanceof Error) {
          return { authData: undefined, isLoading: false, error: response };
        }
        return { authData: response, isLoading: false, error: null };
      },
    };
  });

  vi.doMock("@/hooks/useAuth", async () => ({
    default: () => ({
      setUser,
      redirectToExternalUrl,
    }),
  }));
};

describe("OidcAuthPage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should render error message when there is no search params", async () => {
    mockTestParams(new Error("No params"));
    const { default: Component } = await import("./OidcAuthPage");

    renderWithProviders(<Component />);

    expect(
      await screen.findByText(
        "Something went wrong. Please try again or contact our support team.",
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
      {
        ...authUser,
        invitation_id: "test-secure-id",
      },
    ];

    beforeEach(async ({ task: { id } }) => {
      vi.doUnmock("@/features/auth");
      vi.resetModules();

      const taskId = Number(id.substring(id.length - 1));
      mockTestParams(responsesToMock[taskId]);

      const { default: Component } = await import("./OidcAuthPage");
      renderWithProviders(<Component />);
    });

    it("should render error message when an error occurs", async () => {
      expect(
        screen.getByText(
          "Something went wrong. Please try again or contact our support team.",
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
        new URL(HOMEPAGE_PATH, location.origin).pathname,
        { replace: true },
      );
    });

    it("should redirect to invitation when invitation_id is present", async () => {
      expect(navigate).toHaveBeenCalledWith(
        "/accept-invitation/test-secure-id",
        { replace: true },
      );
    });
  });

  describe("with an attach_code", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetModules();
    });

    it("should redirect to attach page when attach_code is present", async () => {
      mockTestParams({
        ...authUser,
        attach_code: "123123",
        return_to: null,
      });
      const { default: Component } = await import("./OidcAuthPage");

      renderWithProviders(<Component />);

      expect(navigate).toHaveBeenCalledWith(`/attach`, {
        replace: true,
        state: { success: true },
      });
    });
  });

  describe("SaaS environment", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.mocked(useEnv).mockReturnValue(mockSaas);
      vi.doMock("@/features/account-creation", () => ({
        useGetStandaloneAccount: () => ({ accountExists: false }),
      }));
      vi.doMock("@/constants", async (importOriginal) => ({
        ...(await importOriginal()),
        GENERIC_DOMAIN: "localhost",
      }));
    });

    it("should redirect to create-account when user has no accounts and GENERIC_DOMAIN matches hostname", async () => {
      mockTestParams({
        ...authUser,
        accounts: [],
        current_account: "",
        return_to: null,
      });

      const { default: Component } = await import("./OidcAuthPage");
      renderWithProviders(<Component />);

      expect(navigate).toHaveBeenCalledWith("/create-account", {
        replace: true,
      });
    });

    it("should redirect to no-access when user has no accounts and GENERIC_DOMAIN does not match hostname", async () => {
      vi.resetModules();

      const { default: useEnvFresh } = await import("@/hooks/useEnv");
      vi.mocked(useEnvFresh).mockReturnValue(mockSaas);

      vi.doMock("@/constants", async (importOriginal) => ({
        ...(await importOriginal()),
        GENERIC_DOMAIN: "example.com",
      }));

      vi.doMock("@/features/account-creation", () => ({
        useGetStandaloneAccount: () => ({ accountExists: false }),
      }));

      mockTestParams({
        ...authUser,
        accounts: [],
        current_account: "",
        return_to: null,
      });

      const { default: Component } = await import("./OidcAuthPage");
      renderWithProviders(<Component />);

      expect(navigate).toHaveBeenCalledWith("/no-access", { replace: true });
    });
  });

  describe("Self-hosted environment", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.mocked(useEnv).mockReturnValue(mockSelfHosted);
      vi.doMock("@/features/account-creation", () => ({
        useGetStandaloneAccount: () => ({ accountExists: false }),
      }));
    });

    it("should redirect to create-account when user has no accounts and accountExists is false", async () => {
      mockTestParams({
        ...authUser,
        accounts: [],
        current_account: "",
        return_to: null,
      });

      const { default: Component } = await import("./OidcAuthPage");
      renderWithProviders(<Component />);

      expect(navigate).toHaveBeenCalledWith("/create-account", {
        replace: true,
      });
    });

    it("should redirect to no-access when accountExists is true", async () => {
      vi.resetModules();

      const { default: useEnvFresh } = await import("@/hooks/useEnv");
      vi.mocked(useEnvFresh).mockReturnValue(mockSelfHosted);

      vi.doMock("@/features/account-creation", () => ({
        useGetStandaloneAccount: () => ({ accountExists: true }),
      }));

      mockTestParams({
        ...authUser,
        accounts: [],
        current_account: "",
        return_to: null,
      });

      const { default: Component } = await import("./OidcAuthPage");
      renderWithProviders(<Component />);

      expect(navigate).toHaveBeenCalledWith("/no-access", {
        replace: true,
      });
    });
  });
});
