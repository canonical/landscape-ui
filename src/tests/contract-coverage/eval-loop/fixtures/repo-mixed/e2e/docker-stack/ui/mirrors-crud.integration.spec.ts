import { expect, test } from "@playwright/test";

test.describe("UI integration spec", () => {
  test("sets up mirror data through the UI", async ({ request }) => {
    // This call must NOT count as API-contract coverage.
    const res = await request.get("/debarchive/v1beta1/mirrors");
    expect(res.ok()).toBeTruthy();
  });
});
