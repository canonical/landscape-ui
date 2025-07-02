import { expect, test } from "../../fixtures/auth";
import { clickSidebarButton } from "../../helpers/navigation";
import { USER } from "../../constants";
import { login } from "../../helpers/auth";
import {
  closeWelcomeModal,
  waitForEnvironmentError,
} from "../../helpers/utils";

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
