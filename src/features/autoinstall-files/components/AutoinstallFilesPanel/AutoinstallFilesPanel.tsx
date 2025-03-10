import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Button } from "@canonical/react-components";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { FC } from "react";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileForm from "../AutoinstallFileForm";
import AutoinstallFilesHeader from "../AutoinstallFilesHeader";
import AutoinstallFilesList from "../AutoinstallFilesList";
import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "./constants";

const AutoinstallFilesPanel: FC = () => {
  const { getAutoinstallFilesQuery } = useAutoinstallFiles();
  const { currentPage, pageSize } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const {
    addAutoinstallFileQuery: { mutateAsync: addAutoinstallFile },
  } = useAutoinstallFiles();

  const { data: response, isLoading } = getAutoinstallFilesQuery({
    limit: pageSize,
    offset: currentPage * pageSize - pageSize,
    with_groups: true,
  }) as UseQueryResult<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFileWithGroups>>,
    AxiosError<ApiError>
  >;

  const { results: autoinstallFiles, count } = response?.data ?? {
    results: [],
    count: 0,
  };

  const openAddForm = (): void =>
    setSidePanelContent(
      "Add new autoinstall file",
      <AutoinstallFileForm
        buttonText="Add"
        description="Add autoinstall file. It can be applied during the initial setup of associated instances."
        notification={ADD_AUTOINSTALL_FILE_NOTIFICATION}
        query={addAutoinstallFile}
      />,
    );

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) : !autoinstallFiles.length ? (
        <EmptyState
          icon="file"
          title="No autoinstall files found"
          body={
            <p className="u-no-margin--bottom">
              You haven&#39;t added any autoinstall files yet.
            </p>
          }
          cta={[
            <Button
              key="add-autoinstall-file"
              appearance="positive"
              onClick={openAddForm}
              className="u-no-margin--right"
            >
              Add autoinstall file
            </Button>,
          ]}
        />
      ) : (
        <>
          <AutoinstallFilesHeader openAddForm={openAddForm} />
          <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
        </>
      )}
      <TablePagination
        currentItemCount={autoinstallFiles.length}
        totalItems={count}
      />
    </>
  );
};

export default AutoinstallFilesPanel;
