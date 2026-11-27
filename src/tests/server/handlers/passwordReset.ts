import { API_URL } from "@/constants";
import { http, HttpResponse } from "msw";

export const passwordResetEmail = "reset-practice@example.com";
export const passwordResetTokens = {
  valid: "mock-password-reset-valid",
  expired: "mock-password-reset-expired",
  used: "mock-password-reset-used",
  superseded: "mock-password-reset-superseded",
};

interface ResetToken {
  email: string;
  expiresAt: number;
  used: boolean;
}

export const passwordResetOutbox: { email: string; token: string }[] = [];
const tokens = new Map<string, ResetToken>();
const TOKEN_LIFETIME_MS = 86_400_000;
let sequence = 0;

export function resetPasswordResetState() {
  sequence = 0;
  passwordResetOutbox.length = 0;
  tokens.clear();
  tokens.set(passwordResetTokens.valid, {
    email: passwordResetEmail,
    expiresAt: Date.now() + TOKEN_LIFETIME_MS,
    used: false,
  });
  tokens.set(passwordResetTokens.expired, {
    email: passwordResetEmail,
    expiresAt: Date.now() - 1,
    used: false,
  });
  tokens.set(passwordResetTokens.used, {
    email: passwordResetEmail,
    expiresAt: Date.now() + TOKEN_LIFETIME_MS,
    used: true,
  });
}

resetPasswordResetState();

export function getPasswordResetState() {
  return {
    tokens: [...tokens.entries()],
    outbox: [...passwordResetOutbox],
    sequence,
  };
}

export function restorePasswordResetState(
  state: ReturnType<typeof getPasswordResetState>,
) {
  tokens.clear();
  for (const [key, token] of state.tokens) {
    tokens.set(key, token);
  }
  passwordResetOutbox.splice(0, passwordResetOutbox.length, ...state.outbox);
  ({ sequence } = state);
}

const invalidToken = () =>
  HttpResponse.json(
    {
      error: "InvalidPasswordResetToken",
      message:
        "This password reset link is invalid or has expired. Request a new link.",
    },
    { status: 400 },
  );

const isValid = (token: ResetToken | undefined) =>
  token !== undefined && !token.used && token.expiresAt > Date.now();

export default [
  http.post<never, { email: string }>(
    `${API_URL}password-reset/request`,
    async ({ request }) => {
      const { email } = await request.json();
      if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+$/.test(email)) {
        return HttpResponse.json(
          {
            error: "ValidationError",
            message: "A valid email address is required.",
          },
          { status: 422 },
        );
      }

      if (email === passwordResetEmail) {
        for (const [key, token] of tokens) {
          if (token.email === email) {
            tokens.delete(key);
          }
        }
        const token = `mock-password-reset-request-${++sequence}`;
        tokens.set(token, {
          email,
          expiresAt: Date.now() + TOKEN_LIFETIME_MS,
          used: false,
        });
        passwordResetOutbox.push({ email, token });
      }

      return new HttpResponse(null, { status: 202 });
    },
  ),
  http.get<{ token: string }>(
    `${API_URL}password-reset/:token/status`,
    ({ params }) =>
      isValid(tokens.get(params.token))
        ? HttpResponse.json({ valid: true })
        : invalidToken(),
  ),
  http.post<
    never,
    { token: string; email_address: string; new_password: string }
  >(`${API_URL}password-reset/confirm`, async ({ request }) => {
    const { token, email_address, new_password } = await request.json();
    const resetToken = tokens.get(token);
    if (!isValid(resetToken)) {
      return invalidToken();
    }
    if (resetToken?.email !== email_address) {
      return HttpResponse.json(
        {
          error: "InvalidCredentials",
          message: "This email address does not match the reset token.",
        },
        { status: 401 },
      );
    }
    if (typeof new_password !== "string" || !new_password) {
      return HttpResponse.json(
        { error: "ValidationError", message: "A new password is required." },
        { status: 422 },
      );
    }
    if (resetToken) {
      resetToken.used = true;
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
