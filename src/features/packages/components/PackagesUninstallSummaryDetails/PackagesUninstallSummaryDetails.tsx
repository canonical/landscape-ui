import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { TablePagination } from "@/components/layout/TablePagination";
import { Modal, SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps } from "react-table";
import type { SelectedPackage } from "../../types";
import type { PackageInstance } from "../../types/Package";
import classes from "./PackagesUninstallSummaryDetails.module.scss";
import type { InstanceColumn } from "./types";
import { useGetPackageInstances } from "../../api/useGetPackageInstances";
import usePageParams from "@/hooks/usePageParams";

interface PackagesUninstallSummaryDetailsProps {
  readonly pkg: SelectedPackage;
  readonly instanceIds: number[];
  readonly opened: boolean;
  readonly close: () => void;
  readonly summaryVersion: string;
}

const PackagesUninstallSummaryDetails: FC<
  PackagesUninstallSummaryDetailsProps
> = ({ pkg, instanceIds, opened, close, summaryVersion }) => {
  const { currentPage, pageSize } = usePageParams();
  const title = summaryVersion
    ? `Instances with ${pkg.name} ${summaryVersion} installed`
    : `Instances that can't install ${pkg.name}`;
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const clearSearchBox = () => {
    setInputValue("");
    setSearch("");
  };

  const selectedVersions = pkg.versions.map((version) => version);

  const { isPending, data, error } = useGetPackageInstances({
    id: pkg.id,
    action: "uninstall",
    selected_versions: selectedVersions,
    summary_version: summaryVersion,
    search: search,
    limit: pageSize,
    offset: currentPage * pageSize - pageSize,
    query: `id:${instanceIds}`,
  });

  if (error) {
    throw error;
  }

  const instances = data?.data.results ?? [];

  const columns = useMemo<InstanceColumn[]>(
    () => [
      {
        accessor: "title",
        Header: "Instance Name",
        Cell: ({ row }: CellProps<PackageInstance>) => {
          return <span>{row.original.name}</span>;
        },
      },
      {
        accessor: "version",
        Header: "Installed Version",
        Cell: ({ row }: CellProps<PackageInstance>) => {
          return <span>{row.original.installed_version}</span>;
        },
      },
    ],
    [],
  );

  const handleSearch = (_: string) => {
    // setSearch(value);
  };

  return (
    opened && (
      <Modal close={close} title={title}>
        <SearchBox
          placeholder={`Search packages`}
          shouldRefocusAfterReset
          externallyControlled
          value={inputValue}
          onChange={(value) => {
            setInputValue(value);
          }}
          onClear={clearSearchBox}
          onSearch={handleSearch}
        />
        {isPending ? (
          <LoadingState />
        ) : (
          <>
            <ResponsiveTable
              columns={columns}
              data={instances}
              emptyMsg={"Error State"}
              minWidth={400}
              className={classes.table}
            />
            <TablePagination
              totalItems={data.data.count}
              currentItemCount={instances.length}
            />
          </>
        )}
      </Modal>
    )
  );
};

export default PackagesUninstallSummaryDetails;
