import { expect, test } from "@playwright/test";
import { getAuthToken } from "../helpers/auth";

test.describe("Instances API Contract", () => {
  let token = "";

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test("GET /api/v2/computers returns valid list shape", async ({
    request,
  }) => {
    const res = await request.get("/api/v2/computers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body).toHaveProperty("results");
    expect(Array.isArray(body.results)).toBe(true);
    if (body.results.length > 0) {
      expect(body.results[0]).toHaveProperty("id");
      expect(body.results[0]).toHaveProperty("title");
    }
  });

  test("PUT /api/v2/computers/:id updates instance", async ({ request }) => {
    const listRes = await request.get("/api/v2/computers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(listRes.ok()).toBeTruthy();
    const listBody = await listRes.json();

    expect(
      Array.isArray(listBody.results),
      "GET /api/v2/computers should return a results array",
    ).toBe(true);
    expect(
      listBody.results.length,
      "Expected at least one seeded computer; empty list indicates broken seed/setup",
    ).toBeGreaterThan(0);

    const instanceId = listBody.results[0].id;
    const originalTitle = listBody.results[0].title;
    const newTitle = `Updated ${Date.now()}`;

    try {
      const putRes = await request.put(`/api/v2/computers/${instanceId}`, {
        data: { title: newTitle },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(
        putRes.ok(),
        `PUT failed: ${putRes.status()} ${await putRes.text()}`,
      ).toBeTruthy();
    } finally {
      // Restore even if the update assertion fails, to keep the environment idempotent.
      const restoreRes = await request.put(`/api/v2/computers/${instanceId}`, {
        data: { title: originalTitle },
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(
        restoreRes.ok(),
        `Restore PUT failed: ${restoreRes.status()} ${await restoreRes.text()}`,
      ).toBeTruthy();
    }
  });
});
