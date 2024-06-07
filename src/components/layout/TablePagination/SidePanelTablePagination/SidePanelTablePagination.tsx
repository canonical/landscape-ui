import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Icon, Select } from "@canonical/react-components";
import classes from "../TablePagination.module.scss";
import classNames from "classnames";

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
  const [pageNumber, setPageNumber] = useState<number | "">("");
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPageNumber(e.target.valueAsNumber);
      if (e.target.valueAsNumber > totalPages || e.target.valueAsNumber < 1) {
        setError(`"${e.target.valueAsNumber}" is not a valid page number.`);
      } else {
        setError("");
        paginate(e.target.valueAsNumber);
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
              setPageSize(parseInt(event.target.value));
              paginate(1);
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
                onClick={() => {
                  setPageNumber((page) => Number(page) - 1);
                  paginate(currentPage - 1);
                }}
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
                        [classes.smallInput]: !pageNumber || pageNumber < 10,
                        [classes.mediumInput]: pageNumber && pageNumber > 9,
                        [classes.largeInput]: pageNumber && pageNumber > 99,
                        [classes.xLargeInput]: pageNumber && pageNumber > 999,
                      },
                    )}
                    onBlur={() => {
                      setPageNumber(currentPage);
                      setError("");
                    }}
                    onChange={handleChange}
                    required
                    type="number"
                    value={pageNumber}
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
                disabled={currentPage === totalPages || 0 === totalPages}
                onClick={() => {
                  setPageNumber((page) => Number(page) + 1);
                  paginate(currentPage + 1);
                }}
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
