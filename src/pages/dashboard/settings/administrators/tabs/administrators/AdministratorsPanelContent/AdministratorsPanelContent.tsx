import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import AdministratorList from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorList";
import AdministratorsPanelHeader from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorsPanelHeader";
import type { Administrator } from "@/types/Administrator";
import type { FC } from "react";

interface AdministratorsPanelContentProps {
  readonly administrators: Administrator[];
}

const AdministratorsPanelContent: FC<AdministratorsPanelContentProps> = ({
  administrators,
}) => {
  const { search: searchText, pageSize, currentPage } = usePageParams();
  const { getRolesQuery } = useRoles();

  const { data: getRolesQueryResult } = getRolesQuery();

  const getSearchedAdministrators = () => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return administrators;
    }

    return administrators.filter(
      (administrator) =>
        administrator.email.toLowerCase().includes(search) ||
        administrator.name.toLowerCase().includes(search) ||
        administrator.roles.some((role) => role.toLowerCase().includes(search)),
    );
  };

  const searchedAdministrators = getSearchedAdministrators();

  const filteredAdministrators =
    searchedAdministrators.filter(
      (_, index) =>
        index >= (currentPage - 1) * pageSize && index < currentPage * pageSize,
    ) ?? [];

  return (
    <>
      <AdministratorsPanelHeader />
      <AdministratorList
        administrators={filteredAdministrators}
        roles={getRolesQueryResult?.data ?? []}
      />
      {filteredAdministrators.length > 0 && (
        <TablePagination
          totalItems={searchedAdministrators.length}
          currentItemCount={filteredAdministrators.length}
        />
      )}
    </>
  );
};

export default AdministratorsPanelContent;
