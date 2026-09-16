import { expect, test } from "@playwright/test";

test.describe("fixture suite with an orphan call", () => {
  test("calls a route not present in the report", async ({ request }) => {
    const res = await request.get("/api/v2/orphan-route");
    expect(res.ok()).toBeTruthy();
  });
});
