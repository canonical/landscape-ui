import { FC, Suspense, useMemo, useState } from "react";
import useDebug from "../../../hooks/useDebug";
import useActivities from "../../../hooks/useActivities";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import {
  CellProps,
  Column,
  Row,
} from "@canonical/react-components/node_modules/@types/react-table";
import { isActivity } from "./_helpers";
import { Computer } from "../../../types/Computer";
import { getFormattedDateTime } from "../../../utils/output";
import TablePagination from "../../../components/layout/TablePagination";
import classes from "./ActivitiesContainer.module.scss";
import SearchBoxWithDescriptionButton from "../../../components/form/SearchBoxWithDescriptionButton";
import useSidePanel from "../../../hooks/useSidePanel";
import LoadingState from "../../../components/layout/LoadingState";
import ActivityDetails from "./ActivityDetails";
import SearchHelpPopup from "../../../components/layout/SearchHelpPopup";
import { ACTIVITY_SEARCH_HELP_TERMS } from "./_data";

interface ActivitiesContainerProps {
  selectedIds: number[];
  setSelectedIds: (value: number[]) => void;
}

const ActivitiesContainer: FC<ActivitiesContainerProps> = ({
  selectedIds,
  setSelectedIds,
}) => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [pageLimit, setPageLimit] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const debug = useDebug();
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  const { getActivitiesQuery } = useActivities();

  const { data: getActivitiesQueryResult, error: getActivitiesQueryError } =
    getActivitiesQuery({
      query: query ?? undefined,
      limit: pageLimit,
      offset: (currentPage - 1) * pageLimit,
    });

  if (getActivitiesQueryError) {
    debug(getActivitiesQueryError);
  }

  const activities = getActivitiesQueryResult?.data ?? [];

  const activitiesData = useMemo(() => activities, [activities]);

  const toggleAll = () => {
    setSelectedIds(
      selectedIds.length !== 0 ? [] : activities.map(({ id }) => id),
    );
  };

  const handleChange = (row: Row<Record<string, unknown>>) => {
    if (!isActivity(row.original)) {
      return;
    }

    selectedIds.includes(row.original.id)
      ? setSelectedIds(selectedIds.filter((id) => id !== row.original.id))
      : setSelectedIds([...selectedIds, row.original.id]);
  };

  const columns: (Column<Record<string, unknown>> & { className?: string })[] =
    useMemo(
      () => [
        {
          Header: (
            <>
              <CheckboxInput
                label={<span className="u-off-screen">Toggle all</span>}
                inline
                onChange={toggleAll}
                checked={
                  activities.length > 0 &&
                  selectedIds.length === activities.length
                }
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < activities.length
                }
              />
              <span>Description</span>
            </>
          ),
          accessor: "summary",
          className: classes.descriptionColumn,
          Cell: ({
            value,
            row,
          }: CellProps<Record<string, unknown>, unknown>) => {
            if ("string" !== typeof value || !isActivity(row.original)) {
              return null;
            }

            const rowActivity = row.original;

            return (
              <div className={classes.description}>
                <CheckboxInput
                  label={<span className="u-off-screen">{value}</span>}
                  inline
                  labelClassName="u-no-margin--bottom u-no-padding--top"
                  checked={selectedIds.includes(rowActivity.id)}
                  onChange={() => {
                    handleChange(row);
                  }}
                />
                <Button
                  appearance="link"
                  className="u-no-margin--bottom u-no-padding--top"
                  onClick={() => {
                    setSidePanelContent(
                      value,
                      <Suspense fallback={<LoadingState />}>
                        <ActivityDetails activity={rowActivity} />
                      </Suspense>,
                    );
                    setSidePanelOpen(true);
                  }}
                >
                  {value}
                </Button>
              </div>
            );
          },
        },
        {
          Header: "Status",
          accessor: "activity_status",
          getCellIcon: ({ value }: CellProps<Computer, string>) => {
            if ("failed" === value) {
              return `error-grey ${classes.iconErrorGreyRed}`;
            }

            return false;
          },
        },
        {
          Header: "Created at",
          accessor: "creation_time",
          Cell: ({ value }: CellProps<Record<string, unknown>, unknown>) =>
            "string" === typeof value ? (
              <>{getFormattedDateTime(value)}</>
            ) : null,
        },
        {
          Header: "Creator",
          accessor: "creator.name",
        },
      ],
      [selectedIds, activities],
    );

  return (
    <>
      <div className={classes.searchRow}>
        <div className={classes.search}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setCurrentPage(1);
              setQuery(search);
            }}
            noValidate
          >
            <SearchBoxWithDescriptionButton
              inputValue={search}
              onInputChange={(inputValue) => {
                setSearch(inputValue);
              }}
              onSearchClick={() => {
                setQuery(search);
                setSelectedIds([]);
                setCurrentPage(1);
              }}
              onDescriptionClick={() => {
                setShowSearchHelp(true);
              }}
              onClear={() => {
                setSearch("");
                setQuery("");
                setSelectedIds([]);
                setCurrentPage(1);
              }}
            />
          </form>
        </div>
      </div>
      <SearchHelpPopup
        open={showSearchHelp}
        onClose={() => {
          setShowSearchHelp(false);
        }}
        data={ACTIVITY_SEARCH_HELP_TERMS}
      />
      <ModularTable
        columns={columns}
        data={activitiesData}
        className={classes.table}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={2}
        paginate={(page) => {
          setSelectedIds([]);
          setCurrentPage(page);
        }}
        itemsPerPage={pageLimit}
        setItemsPerPage={(itemsNumber) => {
          setPageLimit(itemsNumber);
        }}
      />
    </>
  );
};

export default ActivitiesContainer;
