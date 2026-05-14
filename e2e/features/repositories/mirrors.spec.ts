import { expect, test } from "../../support/fixtures/auth";
import {
  navigateTo,
  navigateToSidebarLink,
} from "../../support/helpers/navigation";
import { waitForEnvironmentError } from "../../support/helpers/utils";

test.describe("@saas", () => {
  test("should not display repository mirrors page in sidebar", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.getByText("Repositories")).not.toBeVisible();
  });

  test("should display environment error when visiting repository mirrors page", async ({
    authenticatedPage,
  }) => {
    await navigateTo(authenticatedPage, "/repositories/mirrors");

    await waitForEnvironmentError(authenticatedPage);
  });
});

test.describe("@self-hosted", () => {
  test("should display repository mirrors page in sidebar", async ({
    authenticatedPage,
  }) => {
    await navigateToSidebarLink(authenticatedPage, "Repositories");

    await expect(authenticatedPage.getByText("Mirrors")).toBeVisible();
  });

  test("should not display environment error when visiting repository mirrors page", async ({
    authenticatedPage,
  }) => {
    await navigateTo(authenticatedPage, "/repositories/mirrors");

    await expect(
      authenticatedPage.getByText("Environment Error"),
    ).not.toBeVisible();
  });
});
