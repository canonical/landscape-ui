import { expect, test } from "@playwright/test";
import { getAuthToken } from "../helpers/auth";

const HTTP_BAD_REQUEST = 400;
const ONE_DAY_MS = 86_400_000;

test.describe("Snaps API Contract", () => {
  let token = "";
  let computerId = 0;

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);

    const listRes = await request.get("/api/v2/computers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(listRes.ok()).toBeTruthy();
    const listBody = await listRes.json();
    expect(
      listBody.results.length,
      "Expected at least one seeded computer; empty list indicates broken seed/setup",
    ).toBeGreaterThan(0);
    computerId = listBody.results[0].id;
  });

  test("POST /api/v2/snaps accepts a hold action with a time arg", async ({
    request,
  }) => {
    // Sample data does not seed any installed snaps, so a valid hold request
    // still fails once it reaches snap resolution. Reaching that stage (rather
    // than an "Invalid args" 400) proves the API accepts `time` as a hold arg.
    const res = await request.post("/api/v2/snaps", {
      data: {
        action: "hold",
        computer_ids: [computerId],
        snaps: [
          {
            name: "no-such-snap",
            args: { time: new Date(Date.now() + ONE_DAY_MS).toISOString() },
          },
        ],
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(HTTP_BAD_REQUEST);
    const body = await res.json();
    expect(body.error).toBe("ApiRequestError");
    expect(body.message).toContain("not applicable");
    expect(body.message).not.toContain("Invalid args");
  });

  test("POST /api/v2/snaps rejects a hold action with an unsupported arg", async ({
    request,
  }) => {
    const res = await request.post("/api/v2/snaps", {
      data: {
        action: "hold",
        computer_ids: [computerId],
        snaps: [{ name: "no-such-snap", args: { channel: "latest/stable" } }],
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(HTTP_BAD_REQUEST);
    const body = await res.json();
    expect(body.error).toBe("ApiRequestError");
    expect(body.message).toContain("Invalid args");
  });
});
