import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { Column } from "react-table";
import { type CellProps } from "react-table";
import type {
  PackageChangePlanItem,
  PackageChangePlanSummaryItem,
} from "../../../../types";
import classes from "./PackagesActionSummaryDetails.module.scss";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import { useListPackageChangePlanItems } from "@/features/packages";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { useCounter } from "usehooks-ts";
import LoadingState from "@/components/layout/LoadingState";

interface PackagesActionSummaryDetailsProps {
  readonly packageChangePlanId: number;
  readonly packageChangePlanSummaryItem: PackageChangePlanSummaryItem;
}

const PackagesActionSummaryDetails: FC<PackagesActionSummaryDetailsProps> = ({
  packageChangePlanId,
  packageChangePlanSummaryItem,
}) => {
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
  } = useListPackageChangePlanItems({
    id: packageChangePlanId,
    package_ids: [packageChangePlanSummaryItem.package_id],
    computer_instance_name: search || undefined,
    limit: DEFAULT_MODAL_PAGE_SIZE,
    offset: (currentPage - 1) * DEFAULT_MODAL_PAGE_SIZE,
  });

  const columns = useMemo<Column<PackageChangePlanItem>[]>(
    () => [
      {
        Header: "Instance Name",
        Cell: ({
          row: { original: item },
        }: CellProps<PackageChangePlanItem>) => {
          return <span>{item.computer.name}</span>;
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
        data={itemsResponse.data.items}
        emptyMsg={"No instances found according to your search parameters."}
        minWidth={400}
        className={classes.table}
        style={{ flex: 1 }}
      />
      <ModalTablePagination
        current={currentPage}
        onPrev={goToPreviousPage}
        onNext={goToNextPage}
        max={Math.ceil(itemsResponse.data.count / DEFAULT_MODAL_PAGE_SIZE)}
      />
    </>
  );
};

export default PackagesActionSummaryDetails;
