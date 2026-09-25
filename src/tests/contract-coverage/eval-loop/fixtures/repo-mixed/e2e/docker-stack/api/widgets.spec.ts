import { expect, test } from "@playwright/test";

test.describe("fixture API-contract suite", () => {
  test("covers a route", async ({ request }) => {
    const res = await request.get("/api/v2/computers");
    expect(res.ok()).toBeTruthy();
  });
});
