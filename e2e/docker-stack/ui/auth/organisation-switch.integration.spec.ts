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
  await expect(page).toHaveURL(/overview/, { timeout: 30_000 });
  await page.evaluate(() => {
    localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
    localStorage.setItem("_landscape_isDefaultPortalPopupClosed", "true");
  });

  const meResponse = await page.request.get("/api/v2/me");
  expect(meResponse.ok(), `GET /me failed: ${meResponse.status()}`).toBe(true);
  const user: AuthUser = await meResponse.json();
  expect(
    user.accounts.map(({ name }) => name),
    "Testing fixtures must give the authenticated user access to both organisations",
  ).toEqual(expect.arrayContaining(["standalone", "second-account"]));
  expect(["standalone", "second-account"]).toContain(user.current_account);

  await page.goto("/scripts");
  const organisation = page.getByRole("combobox", { name: "Organization" });
  await expect(organisation).toBeVisible();
  await expect(organisation).toHaveValue(user.current_account);

  const targetName =
    user.current_account === "standalone" ? "second-account" : "standalone";
  const target = user.accounts.find(({ name }) => name === targetName);
  if (!target) {
    throw new Error(`Testing fixtures must include account ${targetName}`);
  }
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
  const authRefetched = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/v2/me" &&
      response.request().method() === "GET",
  );
  await organisation.selectOption(target.name);
  const response = await switched;
  expect(
    response.ok(),
    `POST /switch-account failed: ${response.status()} ${await response.text()}`,
  ).toBe(true);

  const authResponse = await authRefetched;
  expect(
    authResponse.ok(),
    `Post-switch GET /me failed: ${authResponse.status()}`,
  ).toBe(true);
  const switchedUser: AuthUser = await authResponse.json();
  expect(switchedUser.current_account).toBe(target.name);

  // The refetch checks that the active auth query survived cache removal, even
  // if another render could repair the UI. Panel closure separately confirms
  // OrganisationSwitch has finished awaiting switchAccount and applying auth state.
  await expect(panel).toBeHidden();
  await expect(organisation).toHaveValue(target.name);
  await expect(organisation.locator("option:checked")).toHaveText(target.title);
  await expect(page).toHaveURL(url);
  expect(navigations, "Switching must not reload or navigate").toEqual([]);
});
