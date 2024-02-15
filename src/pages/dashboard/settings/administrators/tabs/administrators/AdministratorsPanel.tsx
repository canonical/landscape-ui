import { FC, useState } from "react";
import AdministratorsPanelHeader from "./AdministratorsPanelHeader";
import useDebug from "../../../../../../hooks/useDebug";
import useAdministrators from "../../../../../../hooks/useAdministrators";
import useAccessGroup from "../../../../../../hooks/useAccessGroup";
import AdministratorList from "./AdministratorList";
import TablePagination from "../../../../../../components/layout/TablePagination";

const AdministratorsPanel: FC = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const debug = useDebug();
  const { getAdministratorsQuery } = useAdministrators();
  const { getRolesQuery } = useAccessGroup();

  const { data: getRolesQueryResult, error: getRolesQueryError } =
    getRolesQuery();

  if (getRolesQueryError) {
    debug(getRolesQueryError);
  }

  const {
    data: getAdministratorsQueryResult,
    error: getAdministratorsQueryError,
  } = getAdministratorsQuery();

  if (getAdministratorsQueryError) {
    debug(getAdministratorsQueryError);
  }

  const getSearchedAdministrators = () => {
    const administrators = getAdministratorsQueryResult?.data ?? [];
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
      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={(page) => setCurrentPage(page)}
        setPageSize={(itemsNumber) => setPageSize(itemsNumber)}
        totalItems={searchedAdministrators.length}
        currentItemCount={filteredAdministrators.length}
      />
    </>
  );
};

export default AdministratorsPanel;
