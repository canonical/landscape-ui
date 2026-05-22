import { expect, test } from "@playwright/test";
import type { Local, LocalWritable } from "@canonical/landscape-openapi";

function validateLocalShape(repo: Local): repo is Local {
  expect(repo).toHaveProperty("name");
  return true;
}

test.describe("Local Repositories API Contract", () => {
  const testRepoName = `test-local-repo-${Date.now()}`;
  let createdRepoName: string | undefined;

  test.afterAll(async ({ request }) => {
    if (createdRepoName) {
      await request.delete(`/v1beta1/${createdRepoName}`);
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

    const response = await request.post("/v1beta1/locals", { data: payload });
    expect(response.ok(), await response.text()).toBeTruthy();

    const body = await response.json();
    validateLocalShape(body);
    expect(body.name).toContain("locals/");
    createdRepoName = body.name;
  });

  test("GET /v1beta1/locals returns list containing our repo", async ({
    request,
  }) => {
    const response = await request.get("/v1beta1/locals");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty("locals");
    expect(Array.isArray(body.locals)).toBeTruthy();

    if (body.locals.length > 0) {
      validateLocalShape(body.locals[0]);
    }

    const found = body.locals.find((repo: Local) => repo.name === createdRepoName);
    expect(found).toBeDefined();
  });
});
