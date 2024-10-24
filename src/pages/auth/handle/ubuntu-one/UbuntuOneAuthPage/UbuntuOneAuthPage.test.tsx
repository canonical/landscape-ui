import { beforeEach, describe, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { AuthStateResponse } from "@/features/auth";
import { authUser } from "@/tests/mocks/auth";
import { ROOT_PATH } from "@/constants";

const redirectToExternalUrl = vi.fn();
const navigate = vi.fn();

const mockTestParams = (response: AuthStateResponse | Error) => {
  vi.doMock("react-router-dom", async () => ({
    ...(await vi.importActual("react-router-dom")),
    useSearchParams: () => [new URLSearchParams({ enabled: "true" })],
    useNavigate: () => navigate,
  }));

  vi.doMock("@/features/auth", () => ({
    useUnsigned: () => ({
      getAuthStateWithUbuntuOneQuery: () =>
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
    redirectToExternalUrl,
  }));
};

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

describe("UbuntuOneAuthPage", () => {
  beforeEach(async ({ task: { id } }) => {
    vi.doUnmock("react-router-dom");
    vi.doUnmock("@/features/auth");
    vi.resetModules();

    const taskId = Number(id.substring(id.length - 1));

    if (taskId > 0) {
      mockTestParams(responsesToMock[taskId - 1]);
    }

    const { default: Component } = await import("./UbuntuOneAuthPage");

    renderWithProviders(<Component />);
  });

  it("should render error message when there is no search params", async () => {
    expect(
      screen.getByText(
        "Oops! Something went wrong. Please try again or contact our support team.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Back to login" }),
    ).toBeInTheDocument();
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
    expect(redirectToExternalUrl).toHaveBeenCalledWith("https://example.com", {
      replace: true,
    });
  });

  it("should redirect to internal URL when return_to is not external", async () => {
    expect(navigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("should redirect to internal URL when return_to is not provided", async () => {
    expect(navigate).toHaveBeenCalledWith(
      new URL(ROOT_PATH, location.origin).pathname,
      { replace: true },
    );
  });
});
