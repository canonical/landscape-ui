import { expect, type APIRequestContext } from "@playwright/test";

interface AuthUser {
  token: string;
  [key: string]: unknown;
}

/** Fetch the Landscape JWT for authenticated API calls in docker-stack tests. */
export async function getAuthToken(
  request: APIRequestContext,
): Promise<string> {
  const res = await request.get("/api/v2/me");
  expect(res.ok(), `GET /api/v2/me failed: ${res.status()}`).toBe(true);
  const body = (await res.json()) as AuthUser;
  expect(
    typeof body.token,
    "GET /api/v2/me did not return a token — is the session cookie valid?",
  ).toBe("string");
  return body.token;
}
