import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Chip,
  ConfirmationModal,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import { useUpdateAutoinstallFile } from "../../api";
import useDeleteAutoinstallFile from "../../api/useDeleteAutoinstallFile";
import type {
  AutoinstallFile,
  AutoinstallFileWithGroups,
  TabId,
} from "../../types";
import AutoinstallFileDetails from "../AutoinstallFileDetails";
import AutoinstallFileForm from "../AutoinstallFileForm";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import classes from "./AutoinstallFilesList.module.scss";
import {
  EDIT_AUTOINSTALL_FILE_NOTIFICATION,
  LOCAL_STORAGE_ITEM,
  MAX_AUTOINSTALL_FILE_VERSION_COUNT,
} from "./constants";
import { getCellProps, getRowProps, getTableRowsRef } from "./helpers";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFileWithGroups[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { deleteAutoinstallFile } = useDeleteAutoinstallFile();
  const { updateAutoinstallFile } = useUpdateAutoinstallFile();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isEditModalIgnored, setIsEditModalIgnored] = useState(
    !!localStorage.getItem(LOCAL_STORAGE_ITEM),
  );
  const [modalFile, setModalFile] = useState<AutoinstallFile | null>(null);

  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

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
      <div className={classes.container}>
        Edit {file.filename}, v{file.version}
        {file.is_default && (
          <Chip value="default" className="u-no-margin--bottom" readOnly />
        )}
      </div>,
      <AutoinstallFileForm
        buttonText="Save changes"
        description={`The duplicated ${file.filename} will inherit the Employee group assignments of the original file.`}
        initialFile={file}
        notification={EDIT_AUTOINSTALL_FILE_NOTIFICATION}
        query={async ({ contents }) => {
          await updateAutoinstallFile(file.id, { contents });
        }}
      />,
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
    await updateAutoinstallFile(file.id, { is_default: true });

    notify.success({
      message:
        "Employee groups without an Autoinstall file assigned will inherit this default file.",
      title: `You have successfully set ${file.filename} as the default Autoinstall file`,
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
      await deleteAutoinstallFile(modalFile.id);

      notify.success({
        message: `The ${modalFile.filename} Autoinstall file has been permanently removed. All Employee groups associated with this file are now using the default Autoinstall file.`,
        title: `You have successfully removed ${modalFile.filename} Autoinstall file`,
      });
    }
  };

  const openDetails = (
    file: AutoinstallFileWithGroups,
    defaultTabId?: TabId,
  ): void => {
    setSidePanelContent(
      <>
        <div className={classes.container}>
          {file.filename}, v{file.version}
          {file.is_default && (
            <Chip value="default" className="u-no-margin--bottom" readOnly />
          )}
        </div>
      </>,
      <AutoinstallFileDetails
        defaultTabId={defaultTabId}
        file={file}
        edit={openEditModal}
        remove={openRemoveModal}
        setAsDefault={setAsDefault}
        viewVersionHistory={(file: AutoinstallFileWithGroups) => {
          openDetails(file, "version-history");
        }}
      />,
    );
  };

  const columns = useMemo<Column<AutoinstallFileWithGroups>[]>(
    () => [
      {
        accessor: "filename",
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
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
              <Chip value="default" className="u-no-margin--bottom" readOnly />
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
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => {
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
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
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
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <div>{moment(created_at).format(DISPLAY_DATE_TIME_FORMAT)}</div>
        ),
      },
      {
        className: classes.actions,
        Header: "Actions",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <AutoinstallFilesListContextualMenu
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
          title={`Remove ${modalFile.filename}, Autoinstall File`}
        >
          <p>
            You are about to remove {modalFile.filename}, an Autoinstall file.
            This action is irreversible. All Employee groups this file is
            associated with, will have the default Autoinstall file associated
            instead.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AutoinstallFilesList;
