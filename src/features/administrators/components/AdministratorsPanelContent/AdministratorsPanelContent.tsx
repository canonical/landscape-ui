import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import AdministratorList from "../AdministratorList";
import AdministratorsPanelHeader from "../AdministratorsPanelHeader";
import type { Administrator } from "../../types/Administrator";
import type { FC } from "react";

interface AdministratorsPanelContentProps {
  readonly administrators: Administrator[];
}

const AdministratorsPanelContent: FC<AdministratorsPanelContentProps> = ({
  administrators,
}) => {
  const { search: searchText } = usePageParams();
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

  return (
    <>
      <AdministratorsPanelHeader />
      <AdministratorList
        administrators={getSearchedAdministrators()}
        roles={getRolesQueryResult?.data ?? []}
      />
    </>
  );
};

export default AdministratorsPanelContent;
