import { expect, test, type APIRequestContext } from "@playwright/test";
import type { Local, LocalWritable } from "@canonical/landscape-openapi";

interface AuthUser {
  token: string;
  [key: string]: unknown;
}

/** Fetch the JWT for subsequent authenticated API calls. */
async function getAuthToken(request: APIRequestContext): Promise<string> {
  const res = await request.get("/api/v2/me");
  expect(res.ok(), `GET /api/v2/me failed: ${res.status()}`).toBe(true);
  const body = (await res.json()) as AuthUser;
  expect(
    typeof body.token,
    "GET /api/v2/me did not return a token — is the session cookie valid?",
  ).toBe("string");
  return body.token;
}

function validateLocalShape(repo: unknown): asserts repo is Local {
  expect(repo).not.toBeNull();
  expect(typeof repo).toBe("object");
  expect(repo).toHaveProperty("name");
  expect((repo as { name?: unknown }).name).toEqual(expect.any(String));
}

test.describe("Local Repositories API Contract", () => {
  const testRepoName = `test-local-repo-${Date.now()}`;
  let createdRepoName: string | undefined;
  let token = "";

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.afterAll(async ({ request }) => {
    if (createdRepoName) {
      await request.delete(`/v1beta1/${createdRepoName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  });

  test("POST /v1beta1/locals accepts payload and returns Local shape", async ({
    request,
  }) => {
    const payload: LocalWritable = {
      displayName: testRepoName,
      comment: "A test repository created by Playwright API test",
      defaultDistribution: "focal",
      defaultComponent: "main",
    };

    const response = await request.post("/v1beta1/locals", {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok(), await response.text()).toBeTruthy();

    const body = await response.json();
    validateLocalShape(body);
    expect(body.name).toContain("locals/");
    createdRepoName = body.name;
  });

  test("GET /v1beta1/locals returns list containing our repo", async ({
    request,
  }) => {
    const response = await request.get("/v1beta1/locals", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty("locals");
    expect(Array.isArray(body.locals)).toBeTruthy();

    if (body.locals.length > 0) {
      validateLocalShape(body.locals[0]);
    }

    const found = body.locals.find(
      (repo: Local) => repo.name === createdRepoName,
    );
    expect(found).toBeDefined();
  });
});
