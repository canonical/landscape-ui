import { expect, test } from "../../fixtures/auth";
import { navigateToSidebarLink } from "../../helpers/navigation";

test("should update URL when changing page size", async ({
  authenticatedPage,
}) => {
  await navigateToSidebarLink(authenticatedPage, "Activities");
  await authenticatedPage.selectOption('select[name="pageSize"]', "50");
  await expect(authenticatedPage).toHaveURL(/pageSize=50/);
});

test("should update URL when changing page number", async ({
  authenticatedPage,
}) => {
  await navigateToSidebarLink(authenticatedPage, "Activities");
  await authenticatedPage.fill('input[name="currentPage"]', "2");
  await authenticatedPage.keyboard.press("Enter");
  await expect(authenticatedPage).toHaveURL(/currentPage=2/);
});
