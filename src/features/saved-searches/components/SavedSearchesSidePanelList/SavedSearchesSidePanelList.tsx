import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import { ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { SavedSearch } from "../../types";
import SavedSearchActions from "../SavedSearchActions";
import { getCellProps, getRowProps } from "./helpers";

interface SavedSearchesSidePanelListProps {
  readonly savedSearches: SavedSearch[];
}

const SavedSearchesSidePanelList: FC<SavedSearchesSidePanelListProps> = ({
  savedSearches,
}) => {
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();

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
            content={<code>{original.search}</code>}
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
          <SavedSearchActions savedSearch={row.original} />
        ),
      },
    ],
    [expandedRowIndex, handleExpand],
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
