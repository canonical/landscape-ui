import { expect, type APIRequestContext } from "@playwright/test";

interface AuthUser {
  token: string;
  current_account: string;
  [key: string]: unknown;
}

/** Authenticate and return the Landscape JWT for docker-stack API calls. */
export async function getAuthToken(
  request: APIRequestContext,
): Promise<string> {
  const res = await request.post("/api/v2/login", {
    data: {
      email: process.env.CI_ADMIN_EMAIL ?? "john@example.com",
      password: process.env.CI_ADMIN_PASSWORD ?? "pwd",
      account: "standalone",
    },
  });
  expect(res.ok(), `POST /api/v2/login failed: ${res.status()}`).toBe(true);
  const body = (await res.json()) as AuthUser;
  expect(
    body.current_account,
    "Login must select the seeded fixture account",
  ).toBe("standalone");
  expect(typeof body.token, "POST /api/v2/login did not return a token").toBe(
    "string",
  );
  return body.token;
}
