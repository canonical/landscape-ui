import { expect, test } from "@playwright/test";

test.describe("fixture spec (eval-loop extraction target)", () => {
  test("literal, template-literal, and dynamic calls", async ({
    request,
  }) => {
    const res = await request.get("/api/v2/computers");
    expect(res.ok()).toBeTruthy();

    const id = 42;
    await request.get(`/api/v2/computers/${id}`);

    const url = "/api/v2/dynamic";
    await request.post(url, { data: {} });
  });
});
