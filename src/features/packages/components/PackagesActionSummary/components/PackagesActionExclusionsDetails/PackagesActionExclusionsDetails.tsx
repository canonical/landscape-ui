import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { Column } from "react-table";
import { type CellProps } from "react-table";
import classes from "./PackagesActionExclusionsDetails.module.scss";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import { useGetPackageChangePlanExclusionItems } from "@/features/packages";
import LoadingState from "@/components/layout/LoadingState";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";

interface PackagesActionExclusionsDetailsProps {
  readonly id: number;
  readonly packageName: string;
}

const PackagesActionExclusionsDetails: FC<
  PackagesActionExclusionsDetailsProps
> = ({ id, packageName }) => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, paginate] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const {
    data: itemsResponse,
    error: itemsError,
    isPending: isGettingItems,
  } = useGetPackageChangePlanExclusionItems({
    id,
    package_name: packageName,
    computer_instance_name: search || undefined,
  });

  const columns = useMemo<Column<{ id: number; name: string }>[]>(
    () => [
      {
        Header: "Instance name",
        Cell: ({
          row: { original: item },
        }: CellProps<{ id: number; name: string }>) => {
          return <span>{item.name}</span>;
        },
      },
    ],
    [],
  );

  if (itemsError) {
    throw itemsError;
  }

  if (isGettingItems) {
    return <LoadingState />;
  }

  const clearSearchBox = () => {
    setInputText("");
    setSearch("");
    paginate(DEFAULT_CURRENT_PAGE);
  };

  const handleSearch = (value: string) => {
    paginate(DEFAULT_CURRENT_PAGE);
    setSearch(value);
  };

  return (
    <>
      <SearchBox
        placeholder={`Search instances`}
        shouldRefocusAfterReset
        externallyControlled
        value={inputText}
        onChange={setInputText}
        onClear={clearSearchBox}
        onSearch={handleSearch}
        className={classes.search}
      />
      <ResponsiveTable
        columns={columns}
        data={itemsResponse.data.computers.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        )}
        emptyMsg={"No instances found according to your search parameters."}
        minWidth={400}
        className={classes.table}
        style={{ flex: 1 }}
      />
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={paginate}
        setPageSize={setPageSize}
        totalItems={itemsResponse.data.computers.length}
      />
    </>
  );
};

export default PackagesActionExclusionsDetails;
