import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Icon, Select } from "@canonical/react-components";
import classes from "./TablePagination.module.scss";
import classNames from "classnames";
import usePageParams from "@/hooks/usePageParams";

interface TablePaginationProps {
  totalItems: number | undefined;
  className?: string;
  handleClearSelection?: () => void;
  currentItemCount?: number;
}

const TablePagination: FC<TablePaginationProps> = ({
  totalItems,
  className = "",
  currentItemCount = 0,
  handleClearSelection,
}) => {
  const { pageSize, currentPage, setPageParams } = usePageParams();

  const [pageNumber, setPageNumber] = useState<number | "">(currentPage);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (totalItems === undefined) {
      return;
    }

    setTotalPages(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setError("");
    setPageParams({
      pageSize: size,
    });
  };

  const handlePageChange = (page: number) => {
    setPageParams({
      currentPage: page,
    });
    if (handleClearSelection) {
      handleClearSelection();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPageNumber(e.target.valueAsNumber);
      if (e.target.valueAsNumber > totalPages || e.target.valueAsNumber < 1) {
        setError(`"${e.target.valueAsNumber}" is not a valid page number.`);
      } else {
        setError("");
      }
    } else {
      setPageNumber("");
      setError("Enter a page number.");
    }
  };

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
              handlePageSizeChange(parseInt(event.target.value));
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
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                type="button"
              >
                <Icon name="chevron-down" className={classes.icon} />
              </Button>
              <strong>Page </strong>
              <div
                className={classNames("p-form__group p-form-validation", {
                  "is-error": error,
                })}
              >
                <div
                  className={classNames(
                    "p-form__control",
                    classes.inputWrapper,
                    {
                      [classes.withError]: error,
                    },
                  )}
                >
                  <input
                    aria-label="page number"
                    className={classNames(
                      "p-form-validation__input p-pagination__input u-no-margin--bottom",
                      classes.input,
                      {
                        [classes.smallInput]: !currentPage || currentPage < 10,
                        [classes.mediumInput]: currentPage && currentPage > 9,
                        [classes.largeInput]: currentPage && currentPage > 99,
                        [classes.xLargeInput]: currentPage && currentPage > 999,
                      },
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !error) {
                        handlePageChange(e.currentTarget.valueAsNumber);
                      }
                    }}
                    onBlur={(e) => {
                      if (!error) {
                        handlePageChange(e.target.valueAsNumber);
                      } else {
                        setPageNumber(currentPage);
                      }
                      setError("");
                    }}
                    onChange={handleChange}
                    required
                    type="number"
                    value={pageNumber}
                    min={1}
                    max={totalPages}
                  />
                  {error && (
                    <p
                      className={classNames(
                        "p-form-validation__message u-no-margin--bottom",
                        classes.error,
                      )}
                    >
                      {error}
                    </p>
                  )}
                </div>
              </div>
              <strong className={classes.noWrap}>
                of {Math.max(totalPages, 1)}
              </strong>
              <Button
                aria-label="Next page"
                appearance="link"
                className="p-pagination__link--next u-no-margin--bottom u-no-padding--top"
                disabled={currentPage >= totalPages || 0 === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
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

export default TablePagination;
