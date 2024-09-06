import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { ModularTable } from "@canonical/react-components";
import ProviderListActions from "../ProviderListActions";
import { IdentityProvider } from "../../types";
import { UBUNTU_ONE_PROVIDER } from "./constants";

interface ProviderListProps {
  oidcAvailable: boolean;
  oidcProviders: IdentityProvider[];
  ubuntuOneAvailable: boolean;
  ubuntuOneEnabled: boolean;
}

const ProviderList: FC<ProviderListProps> = ({
  oidcAvailable,
  oidcProviders,
  ubuntuOneAvailable,
  ubuntuOneEnabled,
}) => {
  const providerData = useMemo(
    () => [
      ...[{ ...UBUNTU_ONE_PROVIDER, enabled: ubuntuOneEnabled }].slice(
        ubuntuOneAvailable ? 0 : 1,
      ),
      ...oidcProviders.slice(oidcAvailable ? 0 : oidcProviders.length),
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
