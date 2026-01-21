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
