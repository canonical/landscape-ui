import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Chip,
  Icon,
  Modal,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useRemoveAutoinstallFile, useUpdateAutoinstallFile } from "../../api";
import type { TabId } from "../../types";
import type {
  AutoinstallFile,
  AutoinstallFileWithGroups,
} from "../../types/AutoinstallFile";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";
import AutoinstallFileForm from "../AutoinstallFileForm";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import ViewAutoinstallFileDetailsTabs from "../ViewAutoinstallFileDetailsTabs";
import classes from "./AutoinstallFilesList.module.scss";
import {
  CANCEL_BUTTON_TEXT,
  CONTINUE_BUTTON_TEXT,
  LOCAL_STORAGE_ITEM,
  SUBMIT_BUTTON_TEXT,
} from "./constants";
import { getCellProps } from "./helpers";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFileWithGroups[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { notify } = useNotify();
  const { employeeGroups, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const updateAutoinstallFile = useUpdateAutoinstallFile();
  const removeAutoinstallFile = useRemoveAutoinstallFile();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditModalIgnored, setIsEditModalIgnored] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [modalFile, setModalFile] = useState<AutoinstallFile | null>(null);

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_ITEM)) {
      setIsEditModalIgnored(true);
    }
  }, []);

  const closeEditModal = (): void => {
    setIsEditModalVisible(false);
    setIsEditModalIgnored(false);
  };

  const submitEditModal = (file: AutoinstallFile): void => {
    if (isEditModalIgnored) {
      localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    }

    setIsEditModalVisible(false);
    openEditPanelWithoutModal(file);
    setModalFile(null);
  };

  const closeRemoveModal = (): void => {
    setIsRemoveModalVisible(false);
  };

  const submitRemoveModal = async (file: AutoinstallFile): Promise<void> => {
    const promise = removeAutoinstallFile(file.id);

    setIsRemoveModalVisible(false);
    setModalFile(null);

    await promise;

    notify.success({
      message: `The ${file.filename} Autoinstall file has been permanently removed. All Employee groups associated with this file are now using the default Autoinstall file.`,
      title: `You have successfully removed ${file.filename} Autoinstall File`,
    });
  };

  const openDetailsPanel = (
    file: AutoinstallFileWithGroups,
    defaultTabId?: TabId,
  ): void => {
    setSidePanelContent(
      `${file.filename}${file.is_default ? " (default)" : ""}`,

      <>
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            <Button
              className="p-segmented-control__button"
              onClick={() => {
                openEditPanel(file);
              }}
            >
              <Icon name="edit" />
              <span>Edit</span>
            </Button>

            <Button
              className="p-segmented-control__button"
              disabled={file.is_default}
              onClick={() => {
                removeFile(file);
              }}
            >
              <Icon name="delete" />
              <span>Remove</span>
            </Button>
          </div>
        </div>

        <div className={classes.container}>
          <ViewAutoinstallFileDetailsTabs
            defaultTabId={defaultTabId}
            file={file}
            openDetailsPanel={(defaultTabId: TabId) => {
              openDetailsPanel(file, defaultTabId);
            }}
          />
        </div>
      </>,

      "large",
    );
  };

  const openEditPanelWithoutModal = (file: AutoinstallFile): void => {
    setSidePanelContent(
      `Edit ${file.filename}`,
      <AutoinstallFileForm
        buttonText={SUBMIT_BUTTON_TEXT}
        description={`The duplicated ${file.filename} will inherit the Employee group assignments of the original file.`}
        initialFile={file}
        notification={{
          message:
            "has been edited and all the changes made have been saved successfully.",
          title: "You have successfully saved changes for",
        }}
        query={async ({ contents }) => {
          await updateAutoinstallFile(file.id, { contents });
        }}
      />,
    );
  };

  const openEditPanel = (file: AutoinstallFile): void => {
    if (isEditModalIgnored) {
      openEditPanelWithoutModal(file);
    } else {
      setIsEditModalVisible(true);
      setModalFile(file);
    }
  };

  const removeFile = (file: AutoinstallFile): void => {
    setIsRemoveModalVisible(true);
    setModalFile(file);
  };

  const files = useMemo(() => {
    return autoinstallFiles.filter((file) => {
      return (
        file.filename.toLowerCase().includes(search.toLowerCase()) &&
        file.groups.some((group) => {
          return (
            !employeeGroups.length || employeeGroups.includes(group.group_id)
          );
        })
      );
    });
  }, [autoinstallFiles, employeeGroups, search]);

  const columns = useMemo<Column<AutoinstallFileWithGroups>[]>(
    () => [
      {
        accessor: "filename",
        className: classes.cell,
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <div>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={() => openDetailsPanel(original)}
            >
              {`${original.filename}, v${original.version}`}
            </Button>

            {original.is_default && (
              <Chip value="default" className={classes.chip} />
            )}
          </div>
        ),
      },
      {
        accessor: "groups",
        className: classes.cell,
        Header: "Employee Groups Associated",
        Cell: ({
          row: {
            original: { groups },
          },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <AutoinstallFileEmployeeGroupsList
            groupNames={groups.map((group) => group.name)}
          />
        ),
      },
      {
        accessor: "last_modified_at",
        className: classes.largeCell,
        Header: "Last modified",
        Cell: ({
          row: {
            original: { last_modified_at },
          },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <div>
            {moment(last_modified_at).format(DISPLAY_DATE_TIME_FORMAT)}, by
            Stephanie Domas
          </div>
        ),
      },
      {
        accessor: "created_at",
        className: classes.cell,
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
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({
          row: { original },
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <AutoinstallFilesListContextualMenu
            file={original}
            openDetailsPanel={openDetailsPanel}
            openEditPanel={openEditPanel}
            remove={removeFile}
          />
        ),
      },
    ],
    [files],
  );

  return (
    <>
      <ModularTable
        columns={columns}
        data={files}
        getCellProps={getCellProps}
      />

      {isEditModalVisible && modalFile && (
        <Modal
          close={closeEditModal}
          title={
            <span className={classes.capitalize}>
              Edit history limit reached
            </span>
          }
          buttonRow={
            <>
              <Button appearance="base" onClick={closeEditModal}>
                {CANCEL_BUTTON_TEXT}
              </Button>

              <Button
                appearance="positive"
                className="u-no-margin--bottom"
                onClick={() => {
                  submitEditModal(modalFile);
                }}
              >
                <span className={classes.capitalize}>
                  {CONTINUE_BUTTON_TEXT}
                </span>
              </Button>
            </>
          }
        >
          <p className={classes.message}>
            You&apos;ve reached the maximum of 100 saved edits for this file. To
            continue editing, the system will remove the oldest version to make
            space for your new changes. This ensures that the most recent 100
            versions are always retained in the history.
          </p>

          <CheckboxInput
            label="I understand. Don't show this message again."
            onChange={() => {
              setIsEditModalIgnored(!isEditModalIgnored);
            }}
            checked={isEditModalIgnored}
          />
        </Modal>
      )}

      {isRemoveModalVisible && modalFile && (
        <Modal
          close={closeRemoveModal}
          title={
            <span className={classes.capitalize}>
              Remove {modalFile.filename}, Autoinstall file
            </span>
          }
          buttonRow={
            <>
              <Button appearance="base" onClick={closeRemoveModal}>
                {CANCEL_BUTTON_TEXT}
              </Button>

              <Button
                appearance="negative"
                className="u-no-margin--bottom"
                onClick={() => {
                  submitRemoveModal(modalFile);
                }}
              >
                <span className={classes.capitalize}>Remove</span>
              </Button>
            </>
          }
        >
          <p className={classes.message}>
            You are about to remove {modalFile.filename}, an Autoinstall file.
            This action is irreversible. All Employee groups this file is
            associated with, will have the default Autoinstall file associated
            instead.
          </p>
        </Modal>
      )}
    </>
  );
};

export default AutoinstallFilesList;
