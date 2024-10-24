import { beforeEach, describe, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import { authUser } from "@/tests/mocks/auth";
import { ROOT_PATH } from "@/constants";

const user = {
  email: "john@example.com",
  password: "123456789",
};

const navigate = vi.fn();
const redirectToExternalUrl = vi.fn();
const setUser = vi.fn();
const signInWithEmailAndPassword = vi
  .fn()
  .mockResolvedValue({ data: authUser })
  .mockRejectedValueOnce(new Error("Invalid credentials"));

const mockTestParams = (searchParams?: Record<string, string>) => {
  vi.doMock("react-router-dom", async () => ({
    ...(await vi.importActual("react-router-dom")),
    useSearchParams: () => [new URLSearchParams(searchParams)],
    useNavigate: () => navigate,
  }));

  vi.doMock("@/hooks/useAuth", () => ({
    default: () => ({ setUser }),
  }));

  vi.doMock("../../helpers", () => ({
    redirectToExternalUrl,
  }));

  vi.doMock("../../hooks", () => ({
    useUnsigned: () => ({
      signInWithEmailAndPasswordQuery: {
        mutateAsync: signInWithEmailAndPassword,
      },
    }),
  }));
};

const testSearchParams: Record<string, string>[] = [
  {
    "redirect-to": "/dashboard",
  },
  {
    external: "true",
    "redirect-to": "https://example.com",
  },
  {
    external: "true",
  },
];

describe("LoginForm", () => {
  beforeEach(async ({ task: { id } }) => {
    vi.doUnmock("react-router-dom");
    vi.doUnmock("../../hooks");
    vi.resetModules();

    const taskId = Number(id.substring(id.length - 1));

    if (taskId > 1) {
      mockTestParams(testSearchParams[taskId - 2]);
    } else {
      mockTestParams();
    }

    const { default: Component } = await import("./LoginForm");

    renderWithProviders(<Component isEmailIdentityOnly={false} />);

    await userEvent.type(
      screen.getByTestId("email"),
      taskId > 0 ? user.email : user.email.slice(1),
    );

    await userEvent.type(screen.getByTestId("password"), user.password);

    await userEvent.click(
      screen.getByRole("button", {
        name: /sign in/i,
      }),
    );

    if (taskId > 0) {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(user);

      expect(setUser).toHaveBeenCalledWith(authUser);
    }
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
      new URL(ROOT_PATH, location.origin).pathname,
      { replace: true },
    );
  });

  it("should sign in and redirect to provided url", async () => {
    expect(navigate).toHaveBeenCalledWith(testSearchParams[0]["redirect-to"], {
      replace: true,
    });
  });

  it("should sign in and redirect to provided url", async () => {
    expect(redirectToExternalUrl).toHaveBeenCalledWith(
      testSearchParams[1]["redirect-to"],
      { replace: true },
    );
  });

  it("should sign in and redirect to default url", async () => {
    expect(navigate).toHaveBeenCalledWith(
      new URL(ROOT_PATH, location.origin).pathname,
      { replace: true },
    );
  });
});
