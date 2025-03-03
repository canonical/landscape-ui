import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Chip,
  Modal,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { TabId } from "../../types";
import type {
  AutoinstallFile,
  AutoinstallFileWithGroups,
} from "../../types/AutoinstallFile";
import AutoinstallFileDetails from "../AutoinstallFileDetails";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";
import AutoinstallFileForm from "../AutoinstallFileForm";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import classes from "./AutoinstallFilesList.module.scss";
import { LOCAL_STORAGE_ITEM } from "./constants";
import { getCellProps } from "./helpers";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFileWithGroups[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { employeeGroups, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalIgnored, setIsModalIgnored] = useState(false);
  const [modalFile, setModalFile] = useState<AutoinstallFile | null>(null);

  const {
    updateAutoinstallFileQuery: { mutateAsync: updateAutoinstallFile },
  } = useAutoinstallFiles();

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_ITEM)) {
      setIsModalIgnored(true);
    }
  }, []);

  const closeModal = (): void => {
    setIsModalVisible(false);
    setIsModalIgnored(false);
  };

  const continueEditing = (): void => {
    if (isModalIgnored) {
      localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    }

    setIsModalVisible(false);

    if (modalFile) {
      openEditPanelWithoutModal(modalFile);
      setModalFile(null);
    }
  };

  const openDetailsPanel = (
    file: AutoinstallFileWithGroups,
    defaultTabId?: TabId,
  ): void => {
    setSidePanelContent(
      `${file.filename}${file.is_default ? " (default)" : ""}`,
      <AutoinstallFileDetails
        defaultTabId={defaultTabId}
        file={file}
        openDetailsPanel={(defaultTabId: TabId) => {
          openDetailsPanel(file, defaultTabId);
        }}
        openEditPanel={() => {
          openEditPanel(file);
        }}
      />,
      "large",
    );
  };

  const openEditPanelWithoutModal = (file: AutoinstallFile): void => {
    setSidePanelContent(
      `Edit ${file.filename}`,
      <AutoinstallFileForm
        buttonText="Save changes"
        description={`The duplicated ${file.filename} will inherit the Employee group assignments of the original file.`}
        initialFile={file}
        notification={{
          message:
            "has been edited and all the changes made have been saved successfully.",
          title: "You have successfully saved changes for",
        }}
        query={async ({ contents }) => {
          await updateAutoinstallFile({ contents, id: file.id });
        }}
      />,
    );
  };

  const openEditPanel = (file: AutoinstallFile): void => {
    if (isModalIgnored) {
      openEditPanelWithoutModal(file);
    } else {
      setIsModalVisible(true);
      setModalFile(file);
    }
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
            file={original}
            openDetailsPanel={openDetailsPanel}
            openEditPanel={openEditPanel}
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

      {isModalVisible && (
        <Modal
          close={closeModal}
          title="Edit History Limit Reached"
          buttonRow={
            <>
              <Button appearance="base" onClick={closeModal}>
                Cancel
              </Button>

              <Button
                appearance="positive"
                className="u-no-margin--bottom"
                onClick={continueEditing}
              >
                Continue Editing
              </Button>
            </>
          }
        >
          <p>
            You&apos;ve reached the maximum of 100 saved edits for this file. To
            continue editing, the system will remove the oldest version to make
            space for your new changes. This ensures that the most recent 100
            versions are always retained in the history.
          </p>

          <CheckboxInput
            label="I understand. Don't show this message again."
            onChange={() => {
              setIsModalIgnored(!isModalIgnored);
            }}
            checked={isModalIgnored}
          />
        </Modal>
      )}
    </>
  );
};

export default AutoinstallFilesList;
