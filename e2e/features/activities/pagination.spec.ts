import { test } from "../../support/fixtures/auth";
import { navigateToSidebarLink } from "../../support/helpers/navigation";
import { TablePagination } from "../../shared/components/TablePagination";

test("should update URL when changing page size", async ({
  authenticatedPage,
}) => {
  await navigateToSidebarLink(authenticatedPage, "Activities");

  const tablePagination = new TablePagination(authenticatedPage);
  await tablePagination.changePageSize();
});

test("should update URL when changing page number", async ({
  authenticatedPage,
}) => {
  await navigateToSidebarLink(authenticatedPage, "Activities");

  const tablePagination = new TablePagination(authenticatedPage);
  await tablePagination.changeCurrentPage();
});
