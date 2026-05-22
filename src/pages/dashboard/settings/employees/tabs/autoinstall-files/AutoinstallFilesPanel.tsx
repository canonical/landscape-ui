import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  AutoinstallFilesHeader,
  AutoinstallFilesList,
  useAddAutoinstallFile,
  useGetAutoinstallFiles,
  useGetAutoinstallFile,
  type AutoinstallFile,
  type WithMetadata,
} from "@/features/autoinstall-files";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import { lazy, type FC } from "react";
import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "./constants";

const AutoinstallFileForm = lazy(
  async () =>
    import("@/features/autoinstall-files/components/AutoinstallFileForm"),
);

const AutoinstallFileEditForm = lazy(
  async () =>
    import("@/features/autoinstall-files/components/AutoinstallFileEditForm"),
);

const AutoinstallFileSidePanelTitle = lazy(
  async () =>
    import("@/features/autoinstall-files/components/AutoinstallFileSidePanelTitle"),
);

const AutoinstallFileDetails = lazy(
  async () =>
    import("@/features/autoinstall-files/components/AutoinstallFileDetails"),
);

const AutoinstallFileVersion = lazy(
  async () =>
    import("@/features/autoinstall-files/components/AutoinstallFileVersion"),
);

const getAutoinstallFilesContent = ({
  showEmptyState,
  isAutoinstallFilesLoading,
  autoinstallFiles,
  openAddForm,
}: {
  showEmptyState: boolean;
  isAutoinstallFilesLoading: boolean;
  autoinstallFiles: AutoinstallFile[];
  openAddForm: () => void;
}) => {
  if (showEmptyState) {
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

  if (isAutoinstallFilesLoading) {
    return <LoadingState />;
  }

  return <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />;
};

const AutoinstallFilesPanel: FC = () => {
  const {
    currentPage,
    pageSize,
    search,
    lastSidePathSegment,
    name,
    version,
    sidePath,
    setPageParams,
    popSidePathUntilClear,
    popSidePath,
  } = usePageParams();

  const { addAutoinstallFile } = useAddAutoinstallFile();
  const { autoinstallFiles, autoinstallFilesCount, isAutoinstallFilesLoading } =
    useGetAutoinstallFiles({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search,
    });

  const shouldFetch =
    !!name &&
    (lastSidePathSegment === "view-file" ||
      lastSidePathSegment === "edit-file" ||
      lastSidePathSegment === "view-versions" ||
      lastSidePathSegment === "view-version");

  const { autoinstallFile, isAutoinstallFileLoading } = useGetAutoinstallFile(
    { id: Number(name), with_metadata: true },
    { enabled: shouldFetch },
  );

  const openAddForm = (): void => {
    setPageParams({
      sidePath: [...sidePath, "add-file"],
      name: "",
    });
  };

  const showEmptyState =
    !autoinstallFiles.length && !search && !isAutoinstallFilesLoading;

  const autoinstallFileWithMeta =
    autoinstallFile as WithMetadata<AutoinstallFile>;

  const viewVersionInfo =
    lastSidePathSegment === "view-version" && autoinstallFileWithMeta && version
      ? autoinstallFileWithMeta.metadata?.versions?.find(
          (v: { version: number; created_at: string }) =>
            v.version === Number(version),
        )
      : undefined;

  const autoinstallFilesContent = getAutoinstallFilesContent({
    showEmptyState,
    isAutoinstallFilesLoading,
    autoinstallFiles,
    openAddForm,
  });

  return (
    <>
      <AutoinstallFilesHeader openAddForm={openAddForm} />
      {autoinstallFilesContent}
      {!showEmptyState && (
        <TablePagination
          currentItemCount={autoinstallFiles.length}
          totalItems={autoinstallFilesCount}
        />
      )}
      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "add-file" ||
          ((lastSidePathSegment === "view-file" ||
            lastSidePathSegment === "edit-file" ||
            lastSidePathSegment === "view-versions" ||
            (lastSidePathSegment === "view-version" && !!viewVersionInfo)) &&
            !!autoinstallFile)
        }
        size="medium"
      >
        {lastSidePathSegment === "add-file" && (
          <SidePanel.Suspense key="add-file">
            <SidePanel.Header>Add new autoinstall file</SidePanel.Header>
            <SidePanel.Content>
              <AutoinstallFileForm
                buttonText="Add"
                description="Add autoinstall file. It can be applied during the initial setup of associated instances."
                notification={ADD_AUTOINSTALL_FILE_NOTIFICATION}
                onSubmit={addAutoinstallFile}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {(lastSidePathSegment === "view-file" ||
          lastSidePathSegment === "view-versions") &&
          autoinstallFile && (
            <SidePanel.Suspense key="view-file">
              <SidePanel.Header>
                <AutoinstallFileSidePanelTitle file={autoinstallFile} />
              </SidePanel.Header>
              <SidePanel.Content>
                {isAutoinstallFileLoading || !shouldFetch ? (
                  <LoadingState />
                ) : (
                  <AutoinstallFileDetails autoinstallFile={autoinstallFile} />
                )}
              </SidePanel.Content>
            </SidePanel.Suspense>
          )}

        {lastSidePathSegment === "edit-file" && autoinstallFile && (
          <SidePanel.Suspense key="edit-file">
            <SidePanel.Header>
              <AutoinstallFileSidePanelTitle
                file={autoinstallFile}
                title="Edit"
              />
            </SidePanel.Header>
            <SidePanel.Content>
              {isAutoinstallFileLoading || !shouldFetch ? (
                <LoadingState />
              ) : (
                <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />
              )}
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view-version" &&
          autoinstallFile &&
          viewVersionInfo && (
            <SidePanel.Suspense key="view-version">
              <SidePanel.Header>
                <AutoinstallFileSidePanelTitle
                  file={autoinstallFile}
                  version={Number(version)}
                />
              </SidePanel.Header>
              <SidePanel.Content>
                {isAutoinstallFileLoading || !shouldFetch ? (
                  <LoadingState />
                ) : (
                  <AutoinstallFileVersion
                    file={autoinstallFile}
                    goBack={popSidePath}
                    versionInfo={viewVersionInfo}
                  />
                )}
              </SidePanel.Content>
            </SidePanel.Suspense>
          )}
      </SidePanel>
    </>
  );
};

export default AutoinstallFilesPanel;
