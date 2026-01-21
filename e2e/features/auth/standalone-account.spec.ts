import { expect, test } from "../../support/fixtures/auth";
import { USER } from "../../support/constants";
import { navigateTo } from "../../support/helpers/navigation";
import { LoginPage } from "./login.page";

test.describe("@self-hosted", () => {
  test.describe("when no standalone account exists", () => {
    test.use({ standaloneAccountMock: "missing" });

    test("redirects to create-account when no standalone account exists", async ({
      page,
    }) => {
      await navigateTo(page, "/login");

      await expect(page).toHaveURL(/create-account/);
      await expect(
        page.getByRole("button", { name: "Create account" }),
      ).toBeVisible();
    });
  });

  test.describe("when a standalone account exists", () => {
    test.use({ standaloneAccountMock: "exists" });

    test("stays on login when standalone account exists", async ({ page }) => {
      await navigateTo(page, "/login");

      const loginPage = new LoginPage(page);
      await loginPage.checkPageHeading("Sign in to Landscape");
      await loginPage.login(USER.email, USER.password);

      await expect(page).toHaveURL(/overview/);
    });
  });
});
