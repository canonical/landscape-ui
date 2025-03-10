import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  ConfirmationModal,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import useAutoinstallFiles from "../../hooks/useAutoinstallFiles";
import type { TabId } from "../../types";
import type {
  AutoinstallFile,
  AutoinstallFileWithGroups,
} from "../../types/AutoinstallFile";
import AutoinstallFileDetails from "../AutoinstallFileDetails";
import AutoinstallFileForm from "../AutoinstallFileForm";
import AutoinstallFilesListContextualMenu from "../AutoinstallFilesListContextualMenu";
import classes from "./AutoinstallFilesList.module.scss";
import {
  EDIT_AUTOINSTALL_FILE_NOTIFICATION,
  LOCAL_STORAGE_ITEM,
} from "./constants";
import { getCellProps, getRowProps, getTableRowsRef } from "./helpers";
import classNames from "classnames";

interface AutoinstallFilesListProps {
  readonly autoinstallFiles: AutoinstallFileWithGroups[];
}

const AutoinstallFilesList: FC<AutoinstallFilesListProps> = ({
  autoinstallFiles,
}) => {
  const { employeeGroups, search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalIgnored, setIsModalIgnored] = useState(
    !!localStorage.getItem(LOCAL_STORAGE_ITEM),
  );
  const [modalFile, setModalFile] = useState<AutoinstallFile | null>(null);
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  const toggleIsModalIgnored = (): void => {
    setIsModalIgnored((isModalIgnored) => !isModalIgnored);
  };

  useOnClickOutside(
    {
      current:
        expandedRowIndex == null
          ? null
          : tableRowsRef.current[expandedRowIndex],
    },
    () => setExpandedRowIndex(null),
  );

  const {
    updateAutoinstallFileQuery: { mutateAsync: updateAutoinstallFile },
  } = useAutoinstallFiles();

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
      openEditFormWithoutModal(modalFile);
      setModalFile(null);
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
      </>,
      <AutoinstallFileDetails
        defaultTabId={defaultTabId}
        file={file}
        openEditPanel={() => {
          openEditForm(file);
        }}
        openVersionHistory={() => {
          openDetails(file, "version-history");
        }}
      />,
    );
  };

  const openEditFormWithoutModal = (file: AutoinstallFile): void => {
    setSidePanelContent(
      <div className={classes.container}>
        Edit {file.filename}, v{file.version}
        {file.is_default && (
          <span
            className={classNames(
              "p-chip is-dense u-no-margin--bottom",
              classes.chip,
            )}
          >
            <span className="p-chip__value">default</span>
          </span>
        )}
      </div>,
      <AutoinstallFileForm
        buttonText="Save changes"
        description={`The duplicated ${file.filename} will inherit the Employee group assignments of the original file.`}
        initialFile={file}
        notification={EDIT_AUTOINSTALL_FILE_NOTIFICATION}
        query={async ({ contents }) => {
          await updateAutoinstallFile({ contents, id: file.id });
        }}
      />,
    );
  };

  const openEditForm = (file: AutoinstallFile): void => {
    if (isModalIgnored) {
      openEditFormWithoutModal(file);
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
          <div className={classes.container}>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin u-no-padding--top"
              onClick={() => openDetails(original)}
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
        }: CellProps<AutoinstallFileWithGroups>): ReactNode => (
          <TruncatedCell
            content={groups.map((group) => group.name).join(", ")}
            isExpanded={index == expandedRowIndex}
            onExpand={() => {
              setExpandedRowIndex(index);
            }}
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
            openDetailsPanel={openDetails}
            openEditPanel={openEditForm}
          />
        ),
      },
    ],
    [expandedRowIndex, files, openDetails, openEditForm],
  );

  return (
    <>
      <div ref={getTableRowsRef(tableRowsRef)}>
        <ModularTable
          columns={columns}
          data={files}
          getCellProps={getCellProps(expandedRowIndex)}
          getRowProps={getRowProps(expandedRowIndex)}
        />
      </div>

      {isModalVisible && (
        <>
          <ConfirmationModal
            close={closeModal}
            confirmButtonAppearance="positive"
            confirmButtonLabel="Continue Editing"
            onConfirm={continueEditing}
            title="Edit History Limit Reached"
          >
            <p>
              You&apos;ve reached the maximum of 100 saved edits for this file.
              To continue editing, the system will remove the oldest version to
              make space for your new changes. This ensures that the most recent
              100 versions are always retained in the history.
            </p>

            <CheckboxInput
              label="I understand. Don't show this message again."
              onChange={toggleIsModalIgnored}
              checked={isModalIgnored}
            />
          </ConfirmationModal>
        </>
      )}
    </>
  );
};

export default AutoinstallFilesList;
