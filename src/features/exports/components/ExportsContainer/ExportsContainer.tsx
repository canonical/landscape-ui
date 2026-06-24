import EmptyState from "@/components/layout/EmptyState";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { PageParamFilter } from "@/components/filter";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { Link } from "react-router";
import { useGetAllExportJobsList } from "../../api/useGetAllExportJobsList";
import ExportsList from "../ExportsList";
import { EXPORT_TYPE_OPTIONS } from "./constants";

const ExportsContainer: FC = () => {
  const { exportJobs, totalCount, isLoading } = useGetAllExportJobsList();

  const { totalCount: unfilteredCount, isLoading: isLoadingUnfiltered } =
    useGetAllExportJobsList(
      {},
      { listenToUrlParams: false, enablePolling: false },
    );

  if (isLoadingUnfiltered) {
    return <LoadingState />;
  }

  if (!unfilteredCount) {
    return (
      <EmptyState
        icon="export"
        title="No exports found"
        body={
          <p>
            There are no TSV exports yet. You can create one from the{" "}
            <Link to={ROUTES.instances.root()}>Instances</Link> or{" "}
            <Link to={ROUTES.activities.root()}>Activities</Link> page.
          </p>
        }
      />
    );
  }

  return (
    <>
      <HeaderWithSearch
        actions={
          <PageParamFilter
            pageParamKey="type"
            label="Type"
            options={EXPORT_TYPE_OPTIONS}
          />
        }
      />
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <ExportsList exportJobs={exportJobs} />
          <TablePagination
            totalItems={totalCount}
            currentItemCount={exportJobs.length}
          />
        </>
      )}
    </>
  );
};

export default ExportsContainer;
