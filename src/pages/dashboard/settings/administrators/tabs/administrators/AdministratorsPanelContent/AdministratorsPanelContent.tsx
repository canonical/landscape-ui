import { FC, useState } from "react";
import TablePagination from "@/components/layout/TablePagination";
import useRoles from "@/hooks/useRoles";
import { Administrator } from "@/types/Administrator";
import AdministratorList from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorList";
import AdministratorsPanelHeader from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorsPanelHeader";

interface AdministratorsPanelContentProps {
  administrators: Administrator[];
}

const AdministratorsPanelContent: FC<AdministratorsPanelContentProps> = ({
  administrators,
}) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

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
      <AdministratorsPanelHeader
        onClear={() => {
          setSearchText("");
        }}
        onSearch={(inputText) => {
          setSearchText(inputText);
        }}
      />
      <AdministratorList
        administrators={filteredAdministrators}
        emptyMessage={
          searchText.trim()
            ? `No administrators found with the search: "${searchText.trim()}"`
            : "You have no administrators on your Landscape organisation"
        }
        roles={getRolesQueryResult?.data ?? []}
      />
      {filteredAdministrators.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          paginate={(page) => setCurrentPage(page)}
          setPageSize={(itemsNumber) => setPageSize(itemsNumber)}
          totalItems={searchedAdministrators.length}
          currentItemCount={filteredAdministrators.length}
        />
      )}
    </>
  );
};

export default AdministratorsPanelContent;
