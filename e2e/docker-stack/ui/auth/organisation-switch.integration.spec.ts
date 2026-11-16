import { expect, test } from "@playwright/test";
import type { AuthUser } from "../../../../src/features/auth/types/AuthUser";

// A switch changes the session as well as local auth state. Never reuse the
// global setup's session, including for API requests made by this test.
test.use({ storageState: { cookies: [], origins: [] } });

test("organisation switch updates the UI after the handler completes (real backend)", async ({
  page,
}) => {
  await page.goto("/login");
  await page
    .locator('input[name="identifier"]')
    .fill(process.env.CI_ADMIN_EMAIL ?? "john@example.com");
  await page
    .locator('input[name="password"]')
    .fill(process.env.CI_ADMIN_PASSWORD ?? "pwd");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/overview/);
  await page.evaluate(() => {
    localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
    localStorage.setItem("_landscape_isDefaultPortalPopupClosed", "true");
  });

  const meResponse = await page.request.get("/api/v2/me");
  expect(meResponse.ok(), `GET /me failed: ${meResponse.status()}`).toBe(true);
  const user: AuthUser = await meResponse.json();
  expect(
    user.accounts,
    "Testing fixtures must give the authenticated user access to both organisations",
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "standalone", title: "Organization" }),
      expect.objectContaining({
        name: "second-account",
        title: "Second Account",
      }),
    ]),
  );
  expect(["standalone", "second-account"]).toContain(user.current_account);

  await page.goto("/scripts");
  const organisation = page.getByRole("combobox", { name: "Organization" });
  await expect(organisation).toBeVisible();
  await expect(organisation).toHaveValue(user.current_account);

  const target =
    user.current_account === "standalone"
      ? { name: "second-account", title: "Second Account" }
      : { name: "standalone", title: "Organization" };
  await page.getByRole("button", { name: "Add script", exact: true }).click();
  const panel = page.getByRole("heading", { name: "Add script", exact: true });
  await expect(panel).toBeVisible();

  const url = page.url();
  const navigations: string[] = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      navigations.push(frame.url());
    }
  });
  const switched = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/v2/switch-account" &&
      response.request().method() === "POST" &&
      response.request().postDataJSON().account_name === target.name,
  );
  await organisation.selectOption(target.name);
  const response = await switched;
  expect(
    response.ok(),
    `POST /switch-account failed: ${response.status()} ${await response.text()}`,
  ).toBe(true);

  // OrganisationSwitch closes the panel only after awaiting switchAccount,
  // including cache removal/refetch and handleAccountSwitch. The native select
  // changes immediately, so neither its value nor the HTTP response is a barrier.
  await expect(panel).toBeHidden();
  await expect(organisation).toHaveValue(target.name);
  await expect(organisation.locator("option:checked")).toHaveText(target.title);
  await expect(page).toHaveURL(url);
  expect(navigations, "Switching must not reload or navigate").toEqual([]);
});
