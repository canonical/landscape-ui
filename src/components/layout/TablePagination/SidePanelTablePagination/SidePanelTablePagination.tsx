import { FC, useEffect, useState } from "react";
import { Button, Icon, Select } from "@canonical/react-components";
import classes from "../TablePagination.module.scss";
import classNames from "classnames";
import PageNumberInputWithError from "../PageNumberInputWithError";

interface SidePanelTablePaginationProps {
  currentPage: number;
  pageSize: number;
  paginate: (page: number) => void;
  setPageSize: (itemsNumber: number) => void;
  totalItems: number | undefined;
  className?: string;
  currentItemCount?: number;
}

const SidePanelTablePagination: FC<SidePanelTablePaginationProps> = ({
  currentPage,
  pageSize,
  paginate,
  setPageSize,
  totalItems,
  className = "",
  currentItemCount = 0,
}) => {
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (totalItems === undefined) {
      return;
    }

    setTotalPages(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  if (totalPages <= 1 && (!currentItemCount || !totalItems)) {
    return null;
  }

  return (
    <div className={classNames(classes.wrapper, className)}>
      {!!currentItemCount && !!totalItems && (
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

      {totalPages > 1 && (
        <div className={classes.paginationContainer}>
          <Select
            label="Instances per page"
            labelClassName="u-off-screen"
            className="u-no-margin--bottom"
            options={[
              { label: "20 / page", value: 20 },
              { label: "50 / page", value: 50 },
              { label: "100 / page", value: 100 },
            ]}
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

export default SidePanelTablePagination;
