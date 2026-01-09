import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { TablePagination } from "@/components/layout/TablePagination";
import { Modal, SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps } from "react-table";
import type { PackageAction, SelectedPackage } from "../../../../types";
import type { PackageInstance } from "../../../../types/Package";
import classes from "./PackagesActionSummaryDetails.module.scss";
import type { InstanceColumn } from "./types";
import { useGetPackageInstances } from "../../../../api/useGetPackageInstances";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import { mapSummaryActionToPast } from "./helpers";

const pageSize = 10;

interface PackagesActionSummaryDetailsProps {
  readonly pkg: SelectedPackage;
  readonly instanceIds: number[];
  readonly close: () => void;
  readonly summaryVersion: string;
  readonly action: PackageAction;
}

const PackagesUninstallSummaryDetails: FC<
  PackagesActionSummaryDetailsProps
> = ({ pkg, instanceIds, close, summaryVersion, action }) => {
  const { setPageParams, currentPage } = usePageParams();

  const actionPast = mapSummaryActionToPast(action);
  const title = summaryVersion
    ? `Instances with ${pkg.name} ${summaryVersion} ${actionPast}`
    : `Instances that can't ${action} ${pkg.name}`;
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const clearSearchBox = () => {
    setInputText("");
    setSearch("");
    setPageParams({ currentPage: DEFAULT_CURRENT_PAGE });
  };

  const selectedVersions = pkg.versions.map((version) => version);

  const { isPending, data, error } = useGetPackageInstances({
    id: pkg.id,
    action: action,
    selected_versions: selectedVersions,
    summary_version: summaryVersion,
    search: search,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
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
        accessor: "installed version",
        Header: "Installed Version",
        Cell: ({ row }: CellProps<PackageInstance>) => {
          return <span>{row.original.installed_version}</span>;
        },
      },
      {
        accessor: "available version",
        Header: "Latest Available Version",
        Cell: ({ row }: CellProps<PackageInstance>) => {
          return <span>{row.original.latest_available_version}</span>;
        },
      },
    ],
    [],
  );

  const handleSearch = (value: string) => {
    setPageParams({ currentPage: DEFAULT_CURRENT_PAGE });
    setSearch(value);
  };

  return (
    <Modal close={close} title={title} className={classes.modal}>
      <SearchBox
        placeholder={`Search packages`}
        shouldRefocusAfterReset
        externallyControlled
        value={inputText}
        onChange={(value) => {
          setInputText(value);
        }}
        onClear={clearSearchBox}
        onSearch={handleSearch}
      />
      {isPending ? (
        <LoadingState />
      ) : (
        <div className={classes.tableContainer}>
          <ResponsiveTable
            columns={columns}
            data={instances}
            emptyMsg={"No instances found according to your search parameters."}
            minWidth={400}
            className={classes.table}
          />
        </div>
      )}
      <TablePagination
        totalItems={data?.data.count}
        currentItemCount={instances.length}
      />
    </Modal>
  );
};

export default PackagesUninstallSummaryDetails;
