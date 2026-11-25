import { API_URL } from "@/constants";
import type { AuthContextProps } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import useEnv from "@/hooks/useEnv";
import { PATHS, ROUTES } from "@/libs/routes";
import { authUser } from "@/tests/mocks/auth";
import { saasEnv, selfHostedEnv } from "@/tests/mocks/env";
import { allLoginMethods, noneLoginMethods } from "@/tests/mocks/loginMethods";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import {
  passwordResetEmail,
  passwordResetOutbox,
  passwordResetTokens,
} from "@/tests/server/handlers/passwordReset";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Link, Routes } from "react-router";
import { AuthRoutes } from "./AuthRoutes";

vi.mock("@/hooks/useEnv");
vi.mock("@/hooks/useAuth");

const resetPath = (token = passwordResetTokens.valid) =>
  ROUTES.auth.resetPassword({ secureToken: token });
const renderRecovery = (path: string) =>
  renderWithProviders(<Routes>{AuthRoutes}</Routes>, undefined, path);
const findPassword = () =>
  screen.findByLabelText(/^New password/, { selector: "input" });
const submitPassword = async (
  password = "NewPassphrase123",
  email = passwordResetEmail,
) => {
  const user = userEvent.setup();
  const emailInput = await screen.findByLabelText(/Email address/);
  await user.clear(emailInput);
  await user.type(emailInput, email);
  await user.clear(await findPassword());
  await user.type(await findPassword(), password);
  const confirmation = screen.getByLabelText("Confirm new password", {
    exact: false,
    selector: "input",
  });
  await user.clear(confirmation);
  await user.type(confirmation, password);
  await user.click(screen.getByRole("button", { name: "Reset password" }));
};

const mockAuth: AuthContextProps = {
  authorized: false,
  authLoading: false,
  user: null,
  logout: vi.fn(),
  setUser: vi.fn(),
  safeRedirect: vi.fn(),
  redirectToExternalUrl: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  hasAccounts: false,
  isSuperAdmin: false,
  canManageAccounts: false,
  canEnterAccounts: false,
};

beforeEach(() => {
  vi.mocked(useEnv).mockReturnValue(selfHostedEnv);
  vi.mocked(useAuth).mockReturnValue(mockAuth);
});

describe("public password recovery routes", () => {
  it.each([
    [" reset-practice@EXAMPLE.COM ", true],
    ["unknown@example.com", false],
  ])(
    "normalizes %s and shows a generic request confirmation",
    async (email, eligible) => {
      const requestReceived = vi.fn();
      const onRequest = ({ request }: { request: Request }) => {
        if (request.url.endsWith("/password-reset/request")) {
          void request
            .clone()
            .json()
            .then((body) => {
              requestReceived(body, request.headers.get("authorization"));
            });
        }
      };
      server.events.on("request:start", onRequest);
      try {
        renderRecovery(ROUTES.auth.forgotPassword());
        const user = userEvent.setup();
        await user.type(await screen.findByLabelText(/Email address/), email);
        await user.click(screen.getByRole("button", { name: "Submit" }));

        expect(
          await screen.findByRole("heading", {
            name: "Password reset Confirmed",
          }),
        ).toBeVisible();
        expect(
          screen.getByText(/If an account with a local password exists/),
        ).toBeVisible();
        expect(requestReceived).toHaveBeenCalledWith(
          { email: email.trim().replace("EXAMPLE.COM", "example.com") },
          null,
        );
        expect(passwordResetOutbox).toHaveLength(eligible ? 1 : 0);
      } finally {
        server.events.removeListener("request:start", onRequest);
      }
    },
  );

  it("validates the email client-side before sending a request", async () => {
    const requestReceived = vi.fn();
    server.use(
      http.post(`${API_URL}password-reset/request`, () => {
        requestReceived();
        return new HttpResponse(null, { status: 202 });
      }),
    );
    renderRecovery(ROUTES.auth.forgotPassword());
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Submit" }));
    expect(await screen.findByText("This field is required")).toBeVisible();
    await user.type(screen.getByLabelText(/Email address/), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByText("Please provide a valid email address"),
    ).toBeVisible();
    expect(requestReceived).not.toHaveBeenCalled();
  });

  it("does not claim success on a failed request and allows retry", async () => {
    server.use(
      http.post(
        `${API_URL}password-reset/request`,
        () => new HttpResponse(null, { status: 500 }),
        { once: true },
      ),
    );
    renderRecovery(ROUTES.auth.forgotPassword());
    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText(/Email address/),
      passwordResetEmail,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Request failed with status code 500",
    );
    expect(
      screen.queryByRole("heading", { name: "Password reset Confirmed" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByRole("heading", { name: "Password reset Confirmed" }),
    ).toBeVisible();
  });

  it("shows the backend error for a failed reset request", async () => {
    server.use(
      http.post(`${API_URL}password-reset/request`, () =>
        HttpResponse.json(
          {
            error: "RequestFailed",
            message: "Reset requests are unavailable.",
          },
          { status: 503 },
        ),
      ),
    );
    renderRecovery(ROUTES.auth.forgotPassword());
    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText(/Email address/),
      passwordResetEmail,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveClass("u-text--negative");
    expect(alert).toHaveTextContent("Reset requests are unavailable.");
  });

  it("prevents duplicate email requests while submission is pending", async () => {
    const requestReceived = vi.fn();
    const responseReady = Promise.withResolvers<null>();
    server.use(
      http.post(`${API_URL}password-reset/request`, async () => {
        requestReceived();
        await responseReady.promise;
        return new HttpResponse(null, { status: 202 });
      }),
    );
    renderRecovery(ROUTES.auth.forgotPassword());
    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText(/Email address/),
      passwordResetEmail,
    );
    const submit = screen.getByRole("button", { name: "Submit" });
    await user.click(submit);
    expect(submit).toHaveAttribute("aria-disabled", "true");
    await user.click(submit);
    responseReady.resolve(null);
    expect(
      await screen.findByRole("heading", { name: "Password reset Confirmed" }),
    ).toBeVisible();
    expect(requestReceived).toHaveBeenCalledTimes(1);
  });

  it.each([
    PATHS.auth.resetPasswordWithoutToken,
    resetPath("unknown"),
    resetPath(passwordResetTokens.expired),
    resetPath(passwordResetTokens.used),
    resetPath(passwordResetTokens.superseded),
  ])(
    "shows an invalid-link page without password fields for %s",
    async (path) => {
      renderRecovery(path);
      expect(
        await screen.findByRole("heading", {
          name: "Invalid password reset link",
        }),
      ).toBeVisible();
      expect(screen.queryByLabelText(/New password/)).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Request a new link" }),
      ).toHaveAttribute("href", "/forgot-my-password");
    },
  );

  it("waits for token validation before rendering password fields", async () => {
    const statusReceived = vi.fn();
    const responseReady = Promise.withResolvers<null>();
    server.use(
      http.get(
        `${API_URL}password-reset/:token/status`,
        async ({ request }) => {
          statusReceived(
            request.method,
            await request.text(),
            request.headers.get("authorization"),
          );
          await responseReady.promise;
          return HttpResponse.json({ valid: true });
        },
      ),
    );
    renderRecovery(resetPath());
    try {
      await waitFor(() => {
        expect(statusReceived).toHaveBeenCalled();
      });
      expect(screen.getByRole("status")).toBeVisible();
      expect(screen.queryByLabelText(/New password/)).not.toBeInTheDocument();
    } finally {
      responseReady.resolve(null);
    }
    expect(await findPassword()).toBeVisible();
    expect(statusReceived).toHaveBeenCalledWith("GET", "", null);
  });

  it.each(["network", "server"])(
    "allows retry after a %s status failure without calling the link invalid",
    async (failure) => {
      server.use(
        http.get(
          `${API_URL}password-reset/:token/status`,
          () =>
            failure === "network"
              ? HttpResponse.error()
              : new HttpResponse(null, { status: 500 }),
          { once: true },
        ),
      );
      renderRecovery(resetPath());
      expect(
        await screen.findByRole("heading", {
          name: "Unable to validate password reset link",
        }),
      ).toBeVisible();
      expect(screen.queryByLabelText(/New password/)).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Invalid password reset link" }),
      ).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: "Try again" }));
      expect(await findPassword()).toBeVisible();
    },
  );

  it("does not render a form for an invalid token", async () => {
    server.use(
      http.get(`${API_URL}password-reset/:token/status`, () =>
        HttpResponse.json({ valid: false }),
      ),
    );
    renderRecovery(resetPath());
    expect(
      await screen.findByRole("heading", {
        name: "Invalid password reset link",
      }),
    ).toBeVisible();
    expect(screen.queryByLabelText(/New password/)).not.toBeInTheDocument();
  });

  it("validates the form, submits email, token and password, and consumes the token without logging in", async () => {
    const login = vi.fn();
    const received = vi.fn();
    server.use(
      http.post(`${API_URL}login`, () => {
        login();
        return HttpResponse.json({});
      }),
    );
    const onRequest = ({ request }: { request: Request }) => {
      if (request.url.endsWith("/password-reset/confirm")) {
        void request
          .clone()
          .json()
          .then((body) => received(body, request.headers.get("authorization")));
      }
    };
    server.events.on("request:start", onRequest);
    try {
      const view = renderRecovery(resetPath());
      const user = userEvent.setup();
      await user.type(await findPassword(), "weak");
      await user.type(
        screen.getByLabelText(/Confirm new password/),
        "different",
      );
      await user.click(screen.getByRole("button", { name: "Reset password" }));
      expect(await screen.findByText("Passwords must match")).toBeVisible();
      expect(screen.getByText("This field is required")).toBeVisible();
      expect(received).not.toHaveBeenCalled();
      await submitPassword("weak");
      expect(received).not.toHaveBeenCalled();
      await submitPassword("NewPassphrase123", " reset-practice@EXAMPLE.COM ");
      expect(
        await screen.findByRole("heading", { name: "Password Reset Complete" }),
      ).toBeVisible();
      expect(screen.getByText("You may now close this tab.")).toBeVisible();
      expect(received).toHaveBeenCalledTimes(1);
      expect(received).toHaveBeenCalledWith(
        {
          token: passwordResetTokens.valid,
          email_address: passwordResetEmail,
          new_password: "NewPassphrase123",
        },
        null,
      );
      expect(login).not.toHaveBeenCalled();
      view.unmount();
      renderRecovery(resetPath());
      expect(
        await screen.findByRole("heading", {
          name: "Invalid password reset link",
        }),
      ).toBeVisible();
    } finally {
      server.events.removeListener("request:start", onRequest);
    }
  });

  it("shows the backend email mismatch error and allows retry with the correct email", async () => {
    renderRecovery(resetPath());
    await submitPassword("NewPassphrase123", "incorrect@example.com");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveClass("u-text--negative");
    expect(alert).toHaveTextContent(
      "This email address does not match the reset token.",
    );
    expect(await findPassword()).toBeVisible();
    await submitPassword();
    expect(
      await screen.findByRole("heading", { name: "Password Reset Complete" }),
    ).toBeVisible();
  });

  it("shows the backend invalid token message", async () => {
    server.use(
      http.get(`${API_URL}password-reset/:token/status`, () =>
        HttpResponse.json(
          {
            error: "InvalidPasswordResetToken",
            message: "This link is no longer valid.",
          },
          { status: 400 },
        ),
      ),
    );
    renderRecovery(resetPath());
    expect(
      await screen.findByText("This link is no longer valid."),
    ).toBeVisible();
  });

  it("treats a different 400 status error as retryable, not an invalid link", async () => {
    server.use(
      http.get(`${API_URL}password-reset/:token/status`, () =>
        HttpResponse.json(
          { error: "OtherError", message: "Status check unavailable." },
          { status: 400 },
        ),
      ),
    );
    renderRecovery(resetPath());
    expect(
      await screen.findByRole("heading", {
        name: "Unable to validate password reset link",
      }),
    ).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Status check unavailable.",
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  it("rejects a token superseded after the initial status check", async () => {
    renderRecovery(resetPath());
    await findPassword();
    await fetch(`${API_URL}password-reset/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: passwordResetEmail }),
    });
    await submitPassword();
    expect(
      await screen.findByRole("heading", {
        name: "Invalid password reset link",
      }),
    ).toBeVisible();
    expect(screen.queryByLabelText(/New password/)).not.toBeInTheDocument();
  });

  it("keeps the form available after a confirmation server error", async () => {
    server.use(
      http.post(
        `${API_URL}password-reset/confirm`,
        () => new HttpResponse(null, { status: 500 }),
        { once: true },
      ),
    );
    renderRecovery(resetPath());
    await submitPassword();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Request failed with status code 500",
    );
    expect(await findPassword()).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Reset password" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Password Reset Complete" }),
    ).toBeVisible();
  });

  it.each([
    ["SaaS", saasEnv, allLoginMethods],
    [
      "PAM-only",
      selfHostedEnv,
      { ...noneLoginMethods, pam: { available: true, enabled: true } },
    ],
    [
      "SSO-only",
      selfHostedEnv,
      { ...noneLoginMethods, ubuntu_one: { available: true, enabled: true } },
    ],
    [
      "disabled password auth",
      selfHostedEnv,
      { ...allLoginMethods, password: { available: true, enabled: false } },
    ],
  ])("blocks recovery page entry for %s", async (_name, env, methods) => {
    vi.mocked(useEnv).mockReturnValue(env);
    server.use(
      http.get(`${API_URL}login/methods`, () => HttpResponse.json(methods)),
    );
    const requestView = renderRecovery(ROUTES.auth.forgotPassword());
    expect(
      await screen.findByRole("heading", {
        name: "Password recovery unavailable",
      }),
    ).toBeVisible();
    expect(screen.queryByLabelText(/Email address/)).not.toBeInTheDocument();
    requestView.unmount();
    renderRecovery(resetPath());
    expect(
      await screen.findByRole("heading", {
        name: "Password recovery unavailable",
      }),
    ).toBeVisible();
    expect(screen.queryByLabelText(/New password/)).not.toBeInTheDocument();
  });

  it("supports direct links and fresh status checks even when already logged in", async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuth,
      authorized: true,
      user: authUser,
    });
    const statusReceived = vi.fn();
    server.use(
      http.get(`${API_URL}password-reset/:token/status`, () => {
        statusReceived();
        return HttpResponse.json({
          valid: statusReceived.mock.calls.length === 1,
        });
      }),
    );
    renderWithProviders(
      <>
        <Link to={ROUTES.auth.forgotPassword()}>Leave reset page</Link>
        <Link to={resetPath()}>Reopen reset page</Link>
        <Routes>{AuthRoutes}</Routes>
      </>,
      undefined,
      resetPath(),
    );
    expect(await findPassword()).toBeVisible();
    await userEvent.click(
      screen.getByRole("link", { name: "Leave reset page" }),
    );
    await screen.findByLabelText(/Email address/);
    await userEvent.click(
      screen.getByRole("link", { name: "Reopen reset page" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Invalid password reset link",
      }),
    ).toBeVisible();
    expect(statusReceived).toHaveBeenCalledTimes(2);
  });
});
