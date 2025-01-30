import { expect, test } from "../../fixtures/auth";
import { LoginPage } from "../../pages/auth/loginPage";
import { USER } from "../../constants";
import { navigateTo } from "../../helpers/navigation";
import { login } from "../../helpers/auth";

test("should log in successfully", async ({ page }) => {
  // await page.goto(`${process.env.VITE_ROOT_PATH}login`);
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

test("should have disclaimer popup after login", async ({ page }) => {
  await navigateTo(page, "/login");
  await login(page, USER.email, USER.password);
  await expect(
    page.getByText("Welcome to the new Landscape web portal (Preview)"),
  ).toBeVisible();

  await page.click("button:has-text('Got it')");

  await expect(
    page.getByText("Welcome to the new Landscape web portal (Preview)"),
  ).not.toBeVisible();
});
