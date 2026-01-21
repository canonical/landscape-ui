import { expect, test } from "../../support/fixtures/auth";
import { clickSidebarButton } from "../../support/helpers/navigation";
import { USER } from "../../support/constants";
import { login } from "../../support/helpers/auth";
import {
  closeWelcomeModal,
  waitForEnvironmentError,
} from "../../support/helpers/utils";
import { MirrorsPage } from "./mirrors.page";

test.describe("@saas", () => {
  test("should not display repository mirrors page in sidebar", async ({
    authenticatedPage,
  }) => {
    await clickSidebarButton(authenticatedPage, "Repositories");

    await expect(authenticatedPage.getByText("Mirrors")).not.toBeVisible();
  });

  test("should display environment error when visiting repository mirrors page", async ({
    page,
  }) => {
    await login(page, USER.email, USER.password, {
      "redirect-to": "/repositories/mirrors",
    });
    await closeWelcomeModal(page);

    await waitForEnvironmentError(page);
  });
});

test.describe("@self-hosted", () => {
  test("should display repository mirrors page in sidebar", async ({
    authenticatedPage,
  }) => {
    await clickSidebarButton(authenticatedPage, "Repositories");

    await expect(authenticatedPage.getByText("Mirrors")).toBeVisible();
  });

  test("should not display environment error when visiting repository mirrors page", async ({
    page,
  }) => {
    await login(page, USER.email, USER.password, {
      "redirect-to": "/repositories/mirrors",
    });
    await closeWelcomeModal(page);

    const mirrorsPage = new MirrorsPage(page);
    await mirrorsPage.checkPageHeading("Mirrors");
  });
});
