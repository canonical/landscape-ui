import { expect, test } from "@playwright/test";
import type { Local, LocalWritable } from "@canonical/landscape-openapi";
import { getAuthToken } from "../helpers/auth";

function validateLocalShape(repo: unknown): asserts repo is Local {
  expect(repo).not.toBeNull();
  expect(typeof repo).toBe("object");
  expect(repo).toHaveProperty("name");
  expect((repo as { name?: unknown }).name).toEqual(expect.any(String));
}

test.describe("Local Repositories API Contract", () => {
  const testRepoName = `test-local-repo-${Date.now()}`;
  let token = "";

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test("POST/GET/DELETE /v1beta1/locals lifecycle works", async ({
    request,
  }) => {
    const payload: LocalWritable = {
      displayName: testRepoName,
      comment: "A test repository created by Playwright API test",
      defaultDistribution: "focal",
      defaultComponent: "main",
    };

    let createdRepoName: string | undefined;

    try {
      await test.step("create local repository", async () => {
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

      await test.step("list local repositories and find created repo", async () => {
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
    } finally {
      if (createdRepoName) {
        await test.step("delete created local repository", async () => {
          await request.delete(`/v1beta1/${createdRepoName}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        });
      }
    }
  });
});
