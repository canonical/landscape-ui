import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useAddAutoinstallFile, useGetAutoinstallFiles } from "../../api";
import AutoinstallFileForm from "../AutoinstallFileForm";
import AutoinstallFilesHeader from "../AutoinstallFilesHeader";
import AutoinstallFilesList from "../AutoinstallFilesList";
import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "./constants";

const AutoinstallFilesPanel: FC = () => {
  const { currentPage, pageSize } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const { autoinstallFiles, autoinstallFilesCount, isAutoinstallFilesLoading } =
    useGetAutoinstallFiles({
      limit: pageSize,
      offset: currentPage * pageSize - pageSize,
      with_groups: true,
    });

  const { addAutoinstallFile } = useAddAutoinstallFile();

  const openAddForm = (): void => {
    setSidePanelContent(
      "Add new autoinstall file",
      <AutoinstallFileForm
        buttonText="Add"
        description="Add autoinstall file. It can be applied during the initial setup of associated instances."
        notification={ADD_AUTOINSTALL_FILE_NOTIFICATION}
        query={addAutoinstallFile}
      />,
    );
  };

  if (isAutoinstallFilesLoading) {
    return <LoadingState />;
  }

  if (!autoinstallFiles.length) {
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
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
      <TablePagination
        currentItemCount={autoinstallFiles.length}
        totalItems={autoinstallFilesCount}
      />
    </>
  );
};

export default AutoinstallFilesPanel;
