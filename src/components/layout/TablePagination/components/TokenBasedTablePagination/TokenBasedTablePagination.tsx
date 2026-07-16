import {
  Button,
  Icon,
  Select,
  type SelectProps,
} from "@canonical/react-components";
import type { FC } from "react";
import classes from "./TokenBasedTablePagination.module.scss";
import { pluralize } from "@/utils/_helpers";

export interface TokenBasedTablePaginationProps {
  readonly currentItemCount: number;
  readonly totalItemCount?: number;
  readonly isTotalExact?: boolean;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly goToNextPage: () => void;
  readonly goToPreviousPage: () => void;
  readonly pageSizeControl?: {
    pageSize: number;
    setPageSize: (itemsNumber: number) => void;
  };
}

const TokenBasedTablePagination: FC<TokenBasedTablePaginationProps> = ({
  currentItemCount,
  totalItemCount,
  isTotalExact = true,
  hasPreviousPage,
  hasNextPage,
  goToNextPage,
  goToPreviousPage,
  pageSizeControl,
}) => {
  if (!totalItemCount && isTotalExact) return null;

  const PAGE_SIZE_OPTIONS: SelectProps["options"] = [
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
  ];

  return (
    <div className={classes.wrapper}>
      {!!pageSizeControl && (
        <div className={classes.pageSizeControls}>
          <span>Advance by:</span>
          <Select
            name="pageSize"
            label={"items per page"}
            labelClassName="u-off-screen"
            className={classes.pageSizeSelect}
            options={PAGE_SIZE_OPTIONS}
            value={pageSizeControl.pageSize}
            onChange={(e) => {
              pageSizeControl.setPageSize(Number(e.target.value));
            }}
          />
          <span>items</span>
        </div>
      )}

      {!!totalItemCount && (
        <span>
          Showing {currentItemCount} of {!isTotalExact && "more than "}
          {pluralize(totalItemCount, ["item"], "exact")}
        </span>
      )}

      <nav aria-label="Table pagination" className={classes.paginationWrapper}>
        <Button
          aria-label="Previous page"
          appearance="link"
          className="u-no-margin--right u-no-margin--bottom u-no-padding--top"
          disabled={!hasPreviousPage}
          onClick={goToPreviousPage}
          type="button"
        >
          <Icon name="chevron-left" />
        </Button>

        <Button
          aria-label="Next page"
          appearance="link"
          className="u-no-margin--bottom u-no-padding--top"
          disabled={!hasNextPage}
          onClick={goToNextPage}
          type="button"
        >
          <Icon name="chevron-right" />
        </Button>
      </nav>
    </div>
  );
};

export default TokenBasedTablePagination;
