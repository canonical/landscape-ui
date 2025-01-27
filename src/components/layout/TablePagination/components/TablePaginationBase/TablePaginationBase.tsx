import { Button, Icon, Select } from "@canonical/react-components";
import classNames from "classnames";
import { FC } from "react";
import { useTotalPages } from "../../hooks";
import PageNumberInputWithError from "../PageNumberInput";
import classes from "./TablePaginationBase.module.scss";
import { PAGE_SIZE_OPTIONS } from "./constants";

interface TablePaginationBaseProps {
  className: string;
  currentItemCount: number;
  currentPage: number;
  pageSize: number;
  paginate: (page: number) => void;
  setPageSize: (itemsNumber: number) => void;
  totalItems: number | undefined;
}

const TablePaginationBase: FC<TablePaginationBaseProps> = ({
  className,
  currentItemCount,
  totalItems,
  pageSize,
  paginate,
  setPageSize,
  currentPage,
}) => {
  const totalPages = useTotalPages(totalItems, pageSize);

  const hasItems = !!currentItemCount && !!totalItems;
  const hasControls = totalPages > 1;

  if (!hasControls && !hasItems) {
    return null;
  }

  return (
    <div className={classNames(classes.wrapper, className)}>
      {hasItems && (
        <p
          className={classNames(
            "p-heading--5 u-no-margin--bottom u-no-padding--top",
            classes.description,
          )}
        >
          {`Showing ${currentItemCount} of ${totalItems} ${
            totalItems === 1 ? "result" : "results"
          }`}
        </p>
      )}

      {hasControls && (
        <div className={classes.paginationContainer}>
          <Select
            label="Instances per page"
            labelClassName="u-off-screen"
            className="u-no-margin--bottom"
            options={PAGE_SIZE_OPTIONS}
            value={pageSize}
            onChange={(event) => {
              paginate(1);
              setPageSize(parseInt(event.target.value));
            }}
          />

          <nav aria-label="Table pagination" className="p-pagination">
            <span
              className={classNames(
                "p-pagination__items",
                classes.paginationWrapper,
              )}
            >
              <Button
                aria-label="Previous page"
                appearance="link"
                className="p-pagination__link--previous u-no-margin--right u-no-margin--bottom u-no-padding--top"
                disabled={currentPage <= 1}
                onClick={() => paginate(currentPage - 1)}
                type="button"
              >
                <Icon name="chevron-down" className={classes.icon} />
              </Button>

              <strong>Page </strong>

              <PageNumberInputWithError
                currentPage={currentPage}
                max={totalPages}
                min={1}
                setCurrentPage={paginate}
              />

              <strong className={classes.noWrap}>
                of {Math.max(totalPages, 1)}
              </strong>

              <Button
                aria-label="Next page"
                appearance="link"
                className="p-pagination__link--next u-no-margin--bottom u-no-padding--top"
                disabled={currentPage >= totalPages}
                onClick={() => paginate(currentPage + 1)}
                type="button"
              >
                <Icon name="chevron-down" className={classes.icon} />
              </Button>
            </span>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TablePaginationBase;
