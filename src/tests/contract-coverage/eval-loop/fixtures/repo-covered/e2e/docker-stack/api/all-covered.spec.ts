import { expect, test } from "@playwright/test";

test.describe("fully-covered fixture suite", () => {
  test("covers every fixture-report route", async ({ request }) => {
    const computers = await request.get("/api/v2/computers");
    expect(computers.ok()).toBeTruthy();

    const mirror = await request.post("/api/v2/mirrors", {
      data: { name: "m" },
    });
    expect(mirror.ok()).toBeTruthy();

    const debarchive = await request.get(
      "/debarchive/v1beta1/mirrors/mirror-1",
    );
    expect(debarchive.ok()).toBeTruthy();
  });
});
