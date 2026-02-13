import { expect, test } from "../../support/fixtures/auth";
import { LoginPage } from "./login.page";
import { USER } from "../../support/constants";
import { navigateTo } from "../../support/helpers/navigation";
import { login } from "../../support/helpers/auth";
import { closeWelcomeModal } from "../../support/helpers/utils";

test("should log in successfully", async ({ page }) => {
  await navigateTo(page, "/login");

  const loginPage = new LoginPage(page);
  await loginPage.checkPageHeading("Sign in to Landscape");
  await loginPage.login(USER.email, USER.password);

  await expect(page).toHaveURL(/overview/);
});

test("should redirect after login if 'redirect-to' arg provided", async ({
  page,
}) => {
  await navigateTo(page, "/login", { "redirect-to": "/scripts" });

  const loginPage = new LoginPage(page);
  await loginPage.login(USER.email, USER.password);

  await expect(page).toHaveURL(/\/scripts/);
});

test("should ignore unsafe external redirect-to javascript scheme", async ({
  page,
}) => {
  await navigateTo(page, "/login", {
    "redirect-to": "javascript:alert(document.domain)",
    external: "true",
  });

  const loginPage = new LoginPage(page);
  await loginPage.login(USER.email, USER.password);

  await expect(page).toHaveURL(/overview/);
});

test("should ignore cross-origin external redirect-to", async ({ page }) => {
  await navigateTo(page, "/login", {
    "redirect-to": "https://example.com",
    external: "true",
  });

  const loginPage = new LoginPage(page);
  await loginPage.login(USER.email, USER.password);

  await expect(page).toHaveURL(/overview/);
});

test("should ignore unsafe external redirect when already authenticated", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.evaluate(() => {
    const url = "/login?redirect-to=https%3A%2F%2Fexample.com&external=true";
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  await expect(authenticatedPage).toHaveURL(/overview/);
});

test("should have disclaimer popup after login", async ({ page }) => {
  await navigateTo(page, "/login");

  await login(page, USER.email, USER.password);

  await expect(page).toHaveURL(/overview/);

  const welcomeModal = page.getByText(
    /This portal is still a work-in-progress/i,
  );

  await closeWelcomeModal(page);
  await expect(welcomeModal).not.toBeVisible();
});
