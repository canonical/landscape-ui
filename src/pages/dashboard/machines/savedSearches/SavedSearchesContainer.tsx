import { FC, lazy, Suspense, useMemo, useState } from "react";
import useDebug from "../../../../hooks/useDebug";
import { useSavedSearches } from "../../../../hooks/useSavedSearches";
import { Button, Icon, ICONS, ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { SavedSearch } from "../../../../types/SavedSearch";
import classes from "./SavedSearchesContainer.module.scss";
import TablePagination from "../../../../components/layout/TablePagination";
import useSidePanel from "../../../../hooks/useSidePanel";
import useConfirm from "../../../../hooks/useConfirm";
import LoadingState from "../../../../components/layout/LoadingState";

const SingleSavedSearch = lazy(() => import("./SingleSavedSearch"));

const SavedSearchesContainer: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  const { getSavedSearchesQuery, removeSavedSearchQuery } = useSavedSearches();

  const {
    data: getSavedSearchesQueryResult,
    isLoading: getSavedSearchesQueryLoading,
    error: getSavedSearchesQueryError,
  } = getSavedSearchesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  if (getSavedSearchesQueryError) {
    debug(getSavedSearchesQueryError);
  }

  const {
    mutateAsync: removeSavedSearch,
    isLoading: removeSavedSearchQueryLoading,
  } = removeSavedSearchQuery;

  const handleEditSavedSearch = (savedSearch: SavedSearch) => {
    setSidePanelContent(
      `Edit "${savedSearch.name}" search`,
      <Suspense fallback={<LoadingState />}>
        <SingleSavedSearch savedSearch={savedSearch} />
      </Suspense>,
    );
    setSidePanelOpen(true);
  };

  const handleRemoveSavedSearch = (savedSearch: SavedSearch) => {
    confirmModal({
      body: "Are you sure?",
      title: `Removing "${savedSearch.title}" search`,
      buttons: [
        <Button
          key={`remove-search-${savedSearch.title}`}
          appearance="negative"
          hasIcon={true}
          onClick={async () => {
            try {
              await removeSavedSearch({
                name: savedSearch.name,
              });
            } catch (error: unknown) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
          aria-label={`Remove ${savedSearch.title} search`}
        >
          {removeSavedSearchQueryLoading && <LoadingState />}
          Remove
        </Button>,
      ],
    });
  };

  const savedSearches = useMemo(
    () => getSavedSearchesQueryResult?.data ?? [],
    [getSavedSearchesQueryResult],
  );

  const columns = useMemo<Column<SavedSearch>[]>(
    () => [
      {
        accessor: "title",
        className: classes.title,
        Header: "Title",
      },
      {
        accessor: "name",
        className: classes.name,
        Header: "Name",
      },
      {
        accessor: "search",
        Header: "Search",
      },
      {
        accessor: "id",
        className: classes.actions,
        Cell: ({ row }: CellProps<SavedSearch>) => (
          <div className={classes.dividedBlocks}>
            <div className={classes.dividedBlock}>
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Edit ${row.original.title} search`}
                onClick={() => {
                  handleEditSavedSearch(row.original);
                }}
              >
                <span className="p-tooltip__message">Edit</span>
                <i className="p-icon--edit u-no-margin--left" />
              </Button>
            </div>
            <div className={classes.dividedBlock}>
              <Button
                small
                hasIcon
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
                aria-label={`Remove ${row.original.title} search`}
                onClick={() => {
                  handleRemoveSavedSearch(row.original);
                }}
              >
                <span className="p-tooltip__message">Remove</span>
                <Icon name={ICONS.delete} className="u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [getSavedSearchesQueryResult],
  );

  return (
    <>
      {getSavedSearchesQueryLoading ? (
        <LoadingState />
      ) : (
        <ModularTable
          columns={columns}
          data={savedSearches}
          emptyMsg="You have no saved searches yet."
          getCellProps={({ column }) => {
            switch (column.id) {
              case "title":
                return { role: "rowheader" };
              case "name":
                return { "aria-label": "Name" };
              case "search":
                return { "aria-label": "Search" };
              case "id":
                return { "aria-label": "Actions" };
              default:
                return {};
            }
          }}
        />
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={10}
        paginate={(page) => {
          setCurrentPage(page);
        }}
        pageSize={pageSize}
        setPageSize={(itemsNumber) => {
          setPageSize(itemsNumber);
        }}
      />
    </>
  );
};

export default SavedSearchesContainer;
