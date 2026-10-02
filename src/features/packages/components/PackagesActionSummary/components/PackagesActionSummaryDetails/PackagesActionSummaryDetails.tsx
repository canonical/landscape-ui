import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { Column } from "react-table";
import { type CellProps } from "react-table";
import type {
  PackageChangePlanItem,
  PackageChangePlanAction,
} from "../../../../types";
import classes from "./PackagesActionSummaryDetails.module.scss";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import {
  type ListPackageChangePlanItemsRequest,
  useListPackageChangePlanItems,
} from "@/features/packages";
import LoadingState from "@/components/layout/LoadingState";

interface PackagesActionSummaryDetailsProps {
  readonly id: number;
  readonly action: PackageChangePlanAction;
}

const PackagesActionSummaryDetails: FC<PackagesActionSummaryDetailsProps> = ({
  id,
  action,
}) => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, paginate] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const query: ListPackageChangePlanItemsRequest = {
    id,
    computer_instance_name: search || undefined,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  };

  switch (action.type) {
    case "install":
      query.install = action.package.id;
      break;
    case "remove":
      query.remove = action.package.id;
      break;
    case "hold":
      query.hold = action.package.id;
      break;
    case "unhold":
      query.unhold = action.package.id;
      break;
    case "change_version":
      query.change_version = {
        from_package_id: action.from_package.id,
        to_package_id: action.to_package.id,
      };
      break;
    case "upgrade":
      query.upgrade = action.to_package.id;
      break;
  }

  const {
    data: itemsResponse,
    error: itemsError,
    isPending: isGettingItems,
  } = useListPackageChangePlanItems(query);

  const columns = useMemo<Column<PackageChangePlanItem>[]>(
    () => [
      {
        Header: "Instance name",
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
        data={itemsResponse.data.items}
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
        totalItems={itemsResponse.data.count}
      />
    </>
  );
};

export default PackagesActionSummaryDetails;
