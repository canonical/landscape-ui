import { expect, test } from "@playwright/test";
import { getAuthToken } from "../helpers/auth";

const HTTP_BAD_REQUEST = 400;
const HTTP_UNPROCESSABLE_CONTENT = 422;

// POST /users:edit only queues an activity, and the docker stack has no client
// to deliver it, so these tests assert the request contract and response shape
// rather than the resulting user record. Nothing changes server-side state that
// later tests read, so no restore step is needed.
test.describe("Users API Contract", () => {
  let token = "";
  let computerId = 0;
  let username = "";

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
    const headers = { Authorization: `Bearer ${token}` };

    const computersRes = await request.get("/api/v2/computers", { headers });
    expect(computersRes.ok()).toBeTruthy();
    const computersBody = await computersRes.json();
    expect(
      computersBody.results.length,
      "Expected at least one seeded computer; empty list indicates broken seed/setup",
    ).toBeGreaterThan(0);

    for (const computer of computersBody.results) {
      const usersRes = await request.get("/api/v2/users", {
        params: { computer_id: computer.id },
        headers,
      });
      expect(usersRes.ok()).toBeTruthy();
      const usersBody = await usersRes.json();
      const [firstUser] = usersBody.results;
      if (firstUser) {
        computerId = computer.id;
        ({ username } = firstUser);
        break;
      }
    }

    expect(
      username,
      "Expected a seeded user on at least one computer; empty list indicates broken seed/setup",
    ).not.toBe("");
  });

  test("POST /api/v2/users:edit clears a field with null", async ({
    request,
  }) => {
    const res = await request.post("/api/v2/users:edit", {
      data: { computer_ids: [computerId], username, location: null },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok(), `${res.status()} ${await res.text()}`).toBeTruthy();

    const body = await res.json();
    expect(body.id).toEqual(expect.any(Number));
    expect(body.summary).toContain(`Edit user ${username}`);
  });

  test("POST /api/v2/users:edit sets and clears fields in one request", async ({
    request,
  }) => {
    const res = await request.post("/api/v2/users:edit", {
      data: {
        computer_ids: [computerId],
        username,
        work_phone: "555-0100",
        home_phone: null,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok(), `${res.status()} ${await res.text()}`).toBeTruthy();

    const body = await res.json();
    expect(body.id).toEqual(expect.any(Number));
  });

  test("POST /api/v2/users:edit rejects null for a required field", async ({
    request,
  }) => {
    const res = await request.post("/api/v2/users:edit", {
      data: { computer_ids: [computerId], username, name: null },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(HTTP_BAD_REQUEST);
  });

  test("POST /api/v2/users:edit rejects an unknown username", async ({
    request,
  }) => {
    const res = await request.post("/api/v2/users:edit", {
      data: {
        computer_ids: [computerId],
        username: `no-such-user-${Date.now()}`,
        location: null,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(HTTP_UNPROCESSABLE_CONTENT);
    const body = await res.json();
    expect(body.error).toBe("Unprocessable Content");
  });
});
