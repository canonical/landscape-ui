import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import useSidePanel from "@/hooks/useSidePanel";
import { ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { Suspense, useCallback, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { SIDEPANEL_SIZE } from "../../constants";
import type { SavedSearch } from "../../types";
import ManageSavedSearchesSidePanel from "../ManageSavedSeachesSidePanel";
import SavedSearchActions from "../SavedSearchActions";
import { getCellProps, getRowProps } from "./helpers";

interface SavedSearchesSidePanelListProps {
  readonly savedSearches: SavedSearch[];
}

const SavedSearchesSidePanelList: FC<SavedSearchesSidePanelListProps> = ({
  savedSearches,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();

  const onBackButtonPress = useCallback(() => {
    setSidePanelContent(
      "Manage saved searches",
      <Suspense fallback={<LoadingState />}>
        <ManageSavedSearchesSidePanel />
      </Suspense>,
      SIDEPANEL_SIZE,
    );
  }, [setSidePanelContent]);

  const columns = useMemo<Column<SavedSearch>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
      },
      {
        accessor: "search",
        Header: "Search Query",
        Cell: ({ row: { original, index } }: CellProps<SavedSearch>) => (
          <TruncatedCell
            content={original.search}
            isExpanded={index === expandedRowIndex}
            onExpand={() => {
              handleExpand(index);
            }}
          />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<SavedSearch>) => (
          <SavedSearchActions
            savedSearch={row.original}
            onBackButtonPress={onBackButtonPress}
          />
        ),
      },
    ],
    [expandedRowIndex, handleExpand, onBackButtonPress],
  );

  return (
    <div ref={getTableRowsRef}>
      <ModularTable
        columns={columns}
        data={savedSearches}
        emptyMsg="No saved searches found."
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default SavedSearchesSidePanelList;
