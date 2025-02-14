import { expect, test } from "../../fixtures/auth";
import { clickSidebarButton } from "../../helpers/navigation";
import { USER } from "../../constants";
import { login } from "../../helpers/auth";
import { closeWelcomeModal } from "../../helpers/utils";
import { MirrorsPage } from "../../pages/repositories/mirrorsPage";

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
  await mirrorsPage.checkPageHeading("Repository Mirrors");
});
