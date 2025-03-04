import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  Chip,
  ConfirmationModal,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment";
import type { FC, HTMLProps, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Cell,
  CellProps,
  Column,
  Row,
  TableCellProps,
  TableRowProps,
} from "react-table";
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
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  const toggleIsModalIgnored = (): void => {
    setIsModalIgnored(!isModalIgnored);
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
      openEditFormWithoutModal(modalFile);
      setModalFile(null);
    }
  };

  const openDetails = (
    file: AutoinstallFileWithGroups,
    defaultTabId?: TabId,
  ): void => {
    setSidePanelContent(
      `${file.filename}${file.is_default ? " (default)" : ""}`,
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
      "large",
    );
  };

  const openEditFormWithoutModal = (file: AutoinstallFile): void => {
    setSidePanelContent(
      `Edit ${file.filename}`,
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

  const getTableRowsRef = (instance: HTMLDivElement | null): void => {
    if (!instance) {
      return;
    }

    tableRowsRef.current = [
      ...instance.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    ];
  };

  const getCellProps = ({
    column,
    row: { index },
  }: Cell<AutoinstallFileWithGroups>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "filename":
        cellProps.role = "rowheader";
        break;
      case "groups":
        cellProps["aria-label"] = "employee groups";

        if (expandedRowIndex === index) {
          cellProps.className = classes.expandedCell;
        }
        break;
      case "last_modified_at":
        cellProps["aria-label"] = "last modified at";
        break;
      case "created_at":
        cellProps["aria-label"] = "created at";
        break;
    }

    return cellProps;
  };

  const getRowProps = ({
    index,
  }: Row<AutoinstallFileWithGroups>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = classes.expandedRow;
    }

    return rowProps;
  };

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
              onClick={() => openDetails(original)}
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
    [files],
  );

  return (
    <>
      <div ref={getTableRowsRef}>
        <ModularTable
          columns={columns}
          data={files}
          getCellProps={getCellProps}
          getRowProps={getRowProps}
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
