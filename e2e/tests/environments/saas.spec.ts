import { expect, test } from "../../fixtures/auth";
import { clickSidebarButton } from "../../helpers/navigation";

test("should not display repository mirrors page", async ({
  authenticatedPage,
}) => {
  await clickSidebarButton(authenticatedPage, "Repositories");

  await expect(authenticatedPage.getByText("Mirrors")).not.toBeVisible();
});
