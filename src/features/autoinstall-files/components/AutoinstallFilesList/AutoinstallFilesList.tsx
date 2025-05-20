import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  ConfirmationModal,
  ModularTable,
} from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import { useDeleteAutoinstallFile, useUpdateAutoinstallFile } from "../../api";
import type {
  AutoinstallFile,
  AutoinstallFileTabId,
  WithGroups,
} from "../../types";
import AutoinstallFileSidePanelTitle from "../AutoinstallFileSidePanelTitle";
import AutoinstallFilesListActions from "../AutoinstallFilesListActions";
import classes from "./AutoinstallFilesList.module.scss";
import {
  EDIT_AUTOINSTALL_FILE_NOTIFICATION,
  LOCAL_STORAGE_ITEM,
  MAX_AUTOINSTALL_FILE_VERSION_COUNT,
} from "./constants";
import { getCellProps, getRowProps, getTableRowsRef } from "./helpers";

const AutoinstallFileDetails = lazy(
  async () => import("../AutoinstallFileDetails"),
);
const AutoinstallFileForm = lazy(async () => import("../AutoinstallFileForm"));

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: WithGroups<AutoinstallFile>[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isEditModalIgnored, setIsEditModalIgnored] = useState(
    !!localStorage.getItem(LOCAL_STORAGE_ITEM),
  );
  const [modalFile, setModalFile] = useState<AutoinstallFile | null>(null);
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { deleteAutoinstallFile } = useDeleteAutoinstallFile();
  const { updateAutoinstallFile } = useUpdateAutoinstallFile();

  useOnClickOutside(
    {
      current:
        expandedRowIndex == null
          ? null
          : tableRowsRef.current[expandedRowIndex],
    },
    () => {
      setExpandedRowIndex(null);
    },
  );

  const toggleIsEditModalIgnored = (): void => {
    setIsEditModalIgnored((isIgnored) => !isIgnored);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalVisible(false);
    setIsEditModalIgnored(false);
  };

  const handleCloseRemoveModal = (): void => {
    setIsRemoveModalVisible(false);
  };

  const openEditForm = (file: AutoinstallFile): void => {
    setSidePanelContent(
      <AutoinstallFileSidePanelTitle file={file} title="Edit" />,
      <Suspense fallback={<LoadingState />}>
        <AutoinstallFileForm
          buttonText="Save changes"
          description={`The duplicated ${file.filename} will inherit the employee group assignments of the original file.`}
          initialFile={file}
          notification={EDIT_AUTOINSTALL_FILE_NOTIFICATION}
          onSubmit={async ({ contents }) => {
            await updateAutoinstallFile({ id: file.id, contents });
          }}
        />
      </Suspense>,
    );
  };

  const openEditModal = (file: AutoinstallFile): void => {
    if (
      isEditModalIgnored ||
      file.version < MAX_AUTOINSTALL_FILE_VERSION_COUNT
    ) {
      openEditForm(file);
    } else {
      setIsEditModalVisible(true);
      setModalFile(file);
    }
  };

  const openRemoveModal = (file: AutoinstallFile): void => {
    setIsRemoveModalVisible(true);
    setModalFile(file);
  };

  const setAsDefault = async (file: AutoinstallFile): Promise<void> => {
    await updateAutoinstallFile({
      id: file.id,
      is_default: true,
      contents: file.contents,
    });

    notify.success({
      message:
        "Employee groups without an autoinstall file assigned will inherit this default file.",
      title: `You have successfully set ${file.filename} as the default autoinstall file`,
    });
  };

  const handleConfirmEditModal = (): void => {
    if (isEditModalIgnored) {
      localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    }

    setIsEditModalVisible(false);

    if (modalFile) {
      openEditForm(modalFile);
      setModalFile(null);
    }
  };

  const handleConfirmRemoveModal = async (): Promise<void> => {
    setIsRemoveModalVisible(false);

    if (modalFile) {
      await deleteAutoinstallFile({ id: modalFile.id });

      closeSidePanel();

      notify.success({
        message: `The ${modalFile.filename} autoinstall file has been permanently removed. All employee groups associated with this file are now using the default autoinstall file.`,
        title: `You have successfully removed ${modalFile.filename} autoinstall file`,
      });
    }
  };

  const openDetails = (
    file: WithGroups<AutoinstallFile>,
    initialTabId?: AutoinstallFileTabId,
  ): void => {
    const handleEdit = (): void => {
      openEditModal(file);
    };

    const handleRemove = (): void => {
      openRemoveModal(file);
    };

    const handleSetAsDefault = (): void => {
      setAsDefault(file);
    };

    setSidePanelContent(
      <AutoinstallFileSidePanelTitle file={file} />,
      <Suspense fallback={<LoadingState />}>
        <AutoinstallFileDetails
          initialTabId={initialTabId}
          file={file}
          edit={handleEdit}
          remove={handleRemove}
          setAsDefault={handleSetAsDefault}
          viewVersionHistory={() => {
            openDetails(file, "version-history");
          }}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<WithGroups<AutoinstallFile>>[]>(
    () => [
      {
        accessor: "filename",
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <div className={classes.container}>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin u-no-padding--top"
              onClick={() => {
                openDetails(original);
              }}
            >
              {`${original.filename}, v${original.version}`}
            </Button>

            {original.is_default && (
              <span
                className={classNames(
                  "p-chip is-dense u-no-margin--bottom",
                  classes.chip,
                )}
              >
                <span className="p-chip__value">default</span>
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: "groups",
        Header: "Employee Groups Associated",
        Cell: ({
          row: {
            original: { groups },
            index,
          },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => {
          if (!groups || groups.length === 0) {
            return <NoData />;
          }

          const [firstGroupName, ...lastGroupNames] = groups.map(
            (group) => group.name,
          );

          return (
            <TruncatedCell
              content={
                <>
                  <span>{firstGroupName}</span>

                  {lastGroupNames.map((groupName, key) => {
                    return <span key={key}>, {groupName}</span>;
                  })}
                </>
              }
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                setExpandedRowIndex(index);
              }}
              showCount
            />
          );
        },
      },
      {
        accessor: "last_modified_at",
        Header: "Last modified",
        Cell: ({
          row: {
            original: { last_modified_at },
          },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <div>{moment(last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
        ),
      },
      {
        accessor: "created_at",
        Header: "Date created",
        Cell: ({
          row: {
            original: { created_at },
          },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <div>{moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: { original },
        }: CellProps<WithGroups<AutoinstallFile>>): ReactNode => (
          <AutoinstallFilesListActions
            edit={openEditModal}
            file={original}
            remove={openRemoveModal}
            setAsDefault={setAsDefault}
            viewDetails={openDetails}
          />
        ),
      },
    ],
    [
      expandedRowIndex,
      autoinstallFiles,
      openDetails,
      openEditModal,
      openRemoveModal,
      setAsDefault,
    ],
  );

  return (
    <>
      <div ref={getTableRowsRef(tableRowsRef)}>
        <ModularTable
          columns={columns}
          data={autoinstallFiles}
          emptyMsg="No autoinstall files found according to your search parameters."
          getCellProps={getCellProps(expandedRowIndex)}
          getRowProps={getRowProps(expandedRowIndex)}
        />
      </div>

      {isEditModalVisible && (
        <ConfirmationModal
          close={handleCloseEditModal}
          confirmButtonAppearance="positive"
          confirmButtonLabel="Continue Editing"
          onConfirm={handleConfirmEditModal}
          title="Edit History Limit Reached"
        >
          <p>
            You&apos;ve reached the maximum of 100 saved edits for this file. To
            continue editing, the system will remove the oldest version to make
            space for your new changes. This ensures that the most recent 100
            versions are always retained in the history.
          </p>

          <CheckboxInput
            label="I understand. Don't show this message again."
            onChange={toggleIsEditModalIgnored}
            checked={isEditModalIgnored}
          />
        </ConfirmationModal>
      )}

      {isRemoveModalVisible && modalFile && (
        <ConfirmationModal
          close={handleCloseRemoveModal}
          confirmButtonAppearance="negative"
          confirmButtonLabel="Remove"
          onConfirm={handleConfirmRemoveModal}
          title={`Remove ${modalFile.filename}, autoinstall File`}
        >
          <p>
            You are about to remove {modalFile.filename}, an autoinstall file.
            This action is irreversible. All employee groups this file is
            associated with, will have the default autoinstall file associated
            instead.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AutoinstallFilesList;
