import { Button, Icon, Select } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useTotalPages } from "../../hooks";
import PageNumberInput from "../PageNumberInput";
import classes from "./TablePaginationBase.module.scss";
import { PAGE_SIZE_OPTIONS } from "./constants";

interface TablePaginationBaseProps {
  readonly className?: string;
  readonly currentItemCount?: number;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly paginate: (page: number) => void;
  readonly setPageSize: (itemsNumber: number) => void;
  readonly totalItems?: number | undefined;
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

  const handleChangePageSize: React.ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    paginate(1);
    setPageSize(parseInt(event.target.value));
  };

  const paginatePrevious = () => {
    paginate(currentPage - 1);
  };

  const paginateNext = () => {
    paginate(currentPage + 1);
  };

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
            onChange={handleChangePageSize}
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
                onClick={paginatePrevious}
                type="button"
              >
                <Icon name="chevron-down" className={classes.icon} />
              </Button>

              <strong>Page </strong>

              <PageNumberInput
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
                onClick={paginateNext}
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
