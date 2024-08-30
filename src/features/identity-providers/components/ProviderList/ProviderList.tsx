import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { ModularTable } from "@canonical/react-components";
import ProviderListActions from "../ProviderListActions";
import { IdentityProvider } from "../../types";
import { UBUNTU_ONE_PROVIDER } from "./constants";

interface ProviderListProps {
  oidcProviders: IdentityProvider[];
  ubuntuOneEnabled: boolean;
}

const ProviderList: FC<ProviderListProps> = ({
  oidcProviders,
  ubuntuOneEnabled,
}) => {
  const providerData = useMemo(
    () => [
      { ...UBUNTU_ONE_PROVIDER, enabled: ubuntuOneEnabled },
      ...oidcProviders,
    ],
    [oidcProviders],
  );

  const columns = useMemo<Column<IdentityProvider>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "enabled",
        Header: "Status",
        Cell: ({ row: { original } }: CellProps<IdentityProvider>) =>
          original.enabled ? "Enabled" : "Disabled",
        getCellIcon: ({ row: { original } }: CellProps<IdentityProvider>) =>
          original.enabled ? "status-succeeded-small" : "status-queued-small",
      },
      {
        accessor: "provider",
        Header: "Provider",
      },
      {
        accessor: "users",
        Header: "User Count",
      },
      {
        accessor: "actions",
        className: "u-align--right",
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<IdentityProvider>) => (
          <ProviderListActions provider={original} />
        ),
      },
    ],
    [providerData],
  );

  return <ModularTable columns={columns} data={providerData} />;
};

export default ProviderList;
