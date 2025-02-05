import { test } from "../../fixtures/auth";
import { navigateToSidebarLink } from "../../helpers/navigation";
import { TablePagination } from "../../components/TablePagination";

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
