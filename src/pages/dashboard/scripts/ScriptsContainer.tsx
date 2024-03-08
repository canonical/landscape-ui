import { FC, lazy, Suspense, useMemo, useState } from "react";
import useDebug from "@/hooks/useDebug";
import useScripts from "@/hooks/useScripts";
import {
  Button,
  Icon,
  ICONS,
  ModularTable,
  Spinner,
} from "@canonical/react-components";
import { CellProps, Column } from "react-table";
import { Script } from "@/types/Script";
import TablePagination from "@/components/layout/TablePagination";
import useConfirm from "@/hooks/useConfirm";
import classes from "./ScriptsContainer.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";

const SingleScript = lazy(() => import("./SingleScript"));

interface ScriptsContainerProps {}

const ScriptsContainer: FC<ScriptsContainerProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();

  const { getScriptsQuery, removeScriptQuery } = useScripts();

  const { mutateAsync: removeScript, isLoading: isRemovingScript } =
    removeScriptQuery;

  const {
    data: getScriptsQueryResult,
    isLoading: getScriptsQueryLoading,
    error: getScriptsQueryError,
  } = getScriptsQuery({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const scripts = useMemo(
    () => getScriptsQueryResult?.data.results ?? [],
    [getScriptsQueryResult],
  );

  if (getScriptsQueryError) {
    debug(getScriptsQueryError);
  }

  const handleScript = (scriptProps: Parameters<typeof SingleScript>[0]) => {
    const title =
      "create" === scriptProps.action
        ? "Create script"
        : `${"copy" === scriptProps.action ? "Copy" : "Edit"} "${
            scriptProps.script.title
          }" script`;

    setSidePanelContent(
      title,
      <Suspense fallback={<LoadingState />}>
        <SingleScript {...scriptProps} />
      </Suspense>,
    );
  };

  const handleScriptRemove = async (script_id: number) => {
    try {
      await removeScript({ script_id });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleScriptRemoveDialog = (script: Script) => {
    confirmModal({
      title: `Removing "${script.title}" script`,
      body: "Are you sure?",
      buttons: [
        <Button
          key={`remove-script-${script.title}`}
          appearance="negative"
          onClick={() => handleScriptRemove(script.id)}
          hasIcon
          aria-label={`Remove ${script.title} script`}
        >
          {isRemovingScript && <Spinner />}
          <span>Remove</span>
        </Button>,
      ],
    });
  };

  const columns = useMemo<Column<Script>[]>(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Access group",
        accessor: "access_group",
        className: classes.accessGroup,
      },
      {
        Header: "Creator",
        accessor: "creator.name",
        className: classes.creator,
      },
      {
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<Script>) => (
          <div className="divided-blocks">
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Copy ${row.original.title} script`}
                onClick={() => {
                  handleScript({ action: "copy", script: row.original });
                }}
              >
                <span className="p-tooltip__message">Duplicate</span>
                <i className="p-icon--fork u-no-margin--left" />
              </Button>
            </div>
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Edit ${row.original.title} script`}
                onClick={() => {
                  handleScript({ action: "edit", script: row.original });
                }}
              >
                <span className="p-tooltip__message">Edit</span>
                <i className="p-icon--edit u-no-margin--left" />
              </Button>
            </div>
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Remove ${row.original.title} script`}
                onClick={() => handleScriptRemoveDialog(row.original)}
              >
                <span className="p-tooltip__message">Remove</span>
                <Icon name={ICONS.delete} className="u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [getScriptsQueryResult],
  );

  return (
    <>
      {getScriptsQueryLoading && <LoadingState />}
      {!getScriptsQueryLoading && 0 === scripts.length && (
        <EmptyState
          title="No scripts found"
          icon="connected"
          body={
            <>
              <p className="u-no-margin--bottom">
                You haven’t added any scripts yet.
              </p>
              <a
                href="https://ubuntu.com/landscape/docs/managing-computers"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                How to manage instances in Landscape
              </a>
            </>
          }
          cta={[
            <Button
              appearance="positive"
              key="table-create-new-mirror"
              onClick={() => {}}
              type="button"
            >
              Create script
            </Button>,
          ]}
        />
      )}
      {!getScriptsQueryLoading && scripts.length > 0 && (
        <>
          <ModularTable
            columns={columns}
            data={scripts}
            emptyMsg={
              getScriptsQueryLoading ? "Loading..." : "No scripts found."
            }
            getCellProps={({ column }) => {
              if (column.id === "title") {
                return { role: "rowheader" };
              } else if (column.id === "access_group") {
                return { "aria-label": "Access group" };
              } else if (column.id === "creator.name") {
                return { "aria-label": "Creator" };
              } else if (column.id === "id") {
                return { "aria-label": "Actions" };
              } else {
                return {};
              }
            }}
          />
          <TablePagination
            currentPage={currentPage}
            totalItems={getScriptsQueryResult?.data.count}
            paginate={(page) => {
              setCurrentPage(page);
            }}
            pageSize={itemsPerPage}
            setPageSize={(itemsNumber) => {
              setItemsPerPage(itemsNumber);
            }}
            currentItemCount={scripts.length}
          />
        </>
      )}
    </>
  );
};

export default ScriptsContainer;
