import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  AutoinstallFilesHeader,
  AutoinstallFilesList,
  useAddAutoinstallFile,
  useGetAutoinstallFiles,
} from "@/features/autoinstall-files";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "./constants";

const AutoinstallFileForm = lazy(async () =>
  import("@/features/autoinstall-files").then((module) => ({
    default: module.AutoinstallFileForm,
  })),
);

const AutoinstallFilesPanel: FC = () => {
  const { currentPage, pageSize, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const { addAutoinstallFile } = useAddAutoinstallFile();
  const { autoinstallFiles, autoinstallFilesCount, isAutoinstallFilesLoading } =
    useGetAutoinstallFiles({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      with_groups: true,
      search,
    });

  const openAddForm = (): void => {
    setSidePanelContent(
      "Add new autoinstall file",
      <Suspense fallback={<LoadingState />}>
        <AutoinstallFileForm
          buttonText="Add"
          description="Add autoinstall file. It can be applied during the initial setup of associated instances."
          notification={ADD_AUTOINSTALL_FILE_NOTIFICATION}
          onSubmit={addAutoinstallFile}
        />
        ,
      </Suspense>,
    );
  };

  if (!autoinstallFiles.length && !search && !isAutoinstallFilesLoading) {
    return (
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
    );
  }

  return (
    <>
      <AutoinstallFilesHeader openAddForm={openAddForm} />
      {isAutoinstallFilesLoading ? (
        <LoadingState />
      ) : (
        <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
      )}
      <TablePagination
        currentItemCount={autoinstallFiles.length}
        totalItems={autoinstallFilesCount}
      />
    </>
  );
};

export default AutoinstallFilesPanel;
