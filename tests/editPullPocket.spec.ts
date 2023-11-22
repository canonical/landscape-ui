import { expect, test } from "@playwright/test";

test("should edit pull pocket", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Edit test-pull-pocket pocket of test-distro/test-derived-series",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-pull-pocket pocket" }),
  ).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveValue("");
  await page.getByRole("textbox").fill("apache2,apt");
  const responsePromise = page.waitForResponse((response) =>
    response.request().url().includes("?action=AddPackageFiltersToPocket"),
  );
  await page.getByRole("button", { name: "Save changes" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json).toHaveProperty("filters");
  expect(json.filters).toEqual(["apache2", "apt"]);
  await expect(
    page.getByRole("heading", { name: "Edit test-pull-pocket pocket" }),
  ).not.toBeVisible();

  await page
    .getByRole("button", {
      name: "Edit test-pull-pocket pocket of test-distro/test-derived-series",
    })
    .click();
  await expect(page.getByRole("textbox")).toHaveValue("apache2,apt");
});
