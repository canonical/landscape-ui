import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { Column } from "react-table";
import { type CellProps } from "react-table";
import classes from "./PackagesActionExclusionsDetails.module.scss";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import { useGetPackageChangePlanExclusionItems } from "@/features/packages";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { useCounter } from "usehooks-ts";
import LoadingState from "@/components/layout/LoadingState";

interface PackagesActionExclusionsDetailsProps {
  readonly id: number;
  readonly packageName: string;
}

const PackagesActionExclusionsDetails: FC<
  PackagesActionExclusionsDetailsProps
> = ({ id, packageName }) => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const {
    count: currentPage,
    decrement: goToPreviousPage,
    increment: goToNextPage,
    reset: resetPage,
  } = useCounter(DEFAULT_CURRENT_PAGE);

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
    resetPage();
  };

  const handleSearch = (value: string) => {
    resetPage();
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
          (currentPage - 1) * DEFAULT_MODAL_PAGE_SIZE,
          currentPage * DEFAULT_MODAL_PAGE_SIZE,
        )}
        emptyMsg={"No instances found according to your search parameters."}
        minWidth={400}
        className={classes.table}
        style={{ flex: 1 }}
      />
      <ModalTablePagination
        current={currentPage}
        onPrev={goToPreviousPage}
        onNext={goToNextPage}
        max={Math.ceil(
          itemsResponse.data.computers.length / DEFAULT_MODAL_PAGE_SIZE,
        )}
      />
    </>
  );
};

export default PackagesActionExclusionsDetails;
