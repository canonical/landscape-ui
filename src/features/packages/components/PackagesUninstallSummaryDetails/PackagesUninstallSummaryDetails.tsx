import { useMemo, useState, type FC } from "react";
import type { SelectedPackage } from "../../types";
import { Modal, SearchBox } from "@canonical/react-components";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { usePackages } from "../../hooks";
import LoadingState from "@/components/layout/LoadingState";
import type { InstancePackageInfoWithInstanceId } from "../../types/Package";
import type { CellProps } from "react-table";
import type { InstanceColumn } from "./types";
import classes from "./PackagesUninstallSummaryDetails.module.scss";
import { TablePagination } from "@/components/layout/TablePagination";

interface PackagesUninstallSummaryDetailsProps {
  readonly pkg: SelectedPackage;
  readonly instanceIds: number[];
  readonly opened: boolean;
  readonly close: () => void;
  readonly selectedVersion: string;
}

const PackagesUninstallSummaryDetails: FC<
  PackagesUninstallSummaryDetailsProps
> = ({ pkg, instanceIds, opened, close, selectedVersion }) => {
  const title = `Instances with ${pkg.package.name} installed`;
  const [search, setSearch] = useState("");

  const clearSearchBox = () => {
    setSearch("");
  };

  const { getPackagesQuery } = usePackages();
  const { data: getPackagesQueryResult, isLoading: getPackagesQueryLoading } =
    getPackagesQuery({
      query: `id:${instanceIds}`,
      names: [`${pkg.package.name}`],
      installed: true,
    });

  const columns = useMemo<InstanceColumn[]>(
    () => [
      {
        accessor: "title",
        Header: "Instance Name",
        Cell: ({ row }: CellProps<InstancePackageInfoWithInstanceId>) => {
          return <span>{row.original.id}</span>;
        },
      },
      {
        accessor: "version",
        Header: "Installed Version",
        Cell: ({ row }: CellProps<InstancePackageInfoWithInstanceId>) => {
          return <span>{row.original.current_version}</span>;
        },
      },
    ],
    [],
  );

  const [packageVersion = null] =
    getPackagesQueryResult?.data.results.filter(
      (item) => item.computers[0].current_version == selectedVersion,
    ) ?? [];
  const data = packageVersion?.computers ?? [];

  return (
    opened && (
      <Modal close={close} title={title}>
        <SearchBox
          placeholder={`Search packages`}
          shouldRefocusAfterReset
          externallyControlled
          value={search}
          onChange={(value) => {
            setSearch(value);
          }}
          onClear={clearSearchBox}
        />
        {getPackagesQueryLoading ? (
          <LoadingState />
        ) : (
          <ResponsiveTable
            columns={columns}
            data={data}
            emptyMsg={"Error State"}
            minWidth={400}
            className={classes.table}
          />
        )}
        <TablePagination
          totalItems={data.length}
          currentItemCount={data.length}
        />
      </Modal>
    )
  );
};

export default PackagesUninstallSummaryDetails;
