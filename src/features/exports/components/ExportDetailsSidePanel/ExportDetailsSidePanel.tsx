import EmptyState from "@/components/layout/EmptyState";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { type FC } from "react";
import { useGetExportJob } from "../../api/useGetExportJob";
import { MIN_SERVER_ERROR_STATUS } from "../../constants";
import ExportDetails from "./ExportDetails";

const ExportDetailsSidePanel: FC = () => {
  const { name: jobId } = usePageParams();

  const {
    exportJob: job,
    isLoading,
    isError,
    error: jobError,
  } = useGetExportJob(jobId ?? "");

  if (isLoading) {
    return <SidePanel.LoadingState />;
  }

  if (!job) {
    const status = jobError?.response?.status;
    const isServerError =
      isError && status !== undefined && status >= MIN_SERVER_ERROR_STATUS;

    return (
      <>
        <SidePanel.Header>
          {isServerError ? "Unable to load export" : "Export not found"}
        </SidePanel.Header>
        <SidePanel.Content>
          <EmptyState
            icon="export"
            title={isServerError ? "Unable to load export" : "Export not found"}
            body={
              <p>
                {isServerError
                  ? "Something went wrong while loading this export. Please try again later."
                  : "This export no longer exists or the link is invalid. It may have already been downloaded and removed, or discarded."}
              </p>
            }
          />
        </SidePanel.Content>
      </>
    );
  }

  return (
    <>
      <SidePanel.Header>{job.name}</SidePanel.Header>
      <SidePanel.Content>
        <ExportDetails job={job} />
      </SidePanel.Content>
    </>
  );
};

export default ExportDetailsSidePanel;
