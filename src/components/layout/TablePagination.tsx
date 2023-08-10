import { FC, useState } from "react";
import { Button, Icon, Select } from "@canonical/react-components";
import classes from "./TablePagination.module.scss";
import classNames from "classnames";

export enum Label {
  Pagination = "Table pagination",
  PreviousPage = "Previous page",
  NextPage = "Next page",
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsNumber: number) => void;
}

const TablePagination: FC<TablePaginationProps> = ({
  totalPages,
  currentPage,
  paginate,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const [pageNumber, setPageNumber] = useState<number | "">(currentPage);
  const [error, setError] = useState("");

  return (
    <div className={classes.wrapper}>
      <nav aria-label={Label.Pagination} className="p-pagination">
        <span
          className={classNames(
            "p-pagination__items",
            classes.paginationWrapper
          )}
        >
          <Button
            aria-label={Label.PreviousPage}
            appearance="link"
            className="p-pagination__link--previous u-no-margin--right u-no-margin--bottom"
            disabled={currentPage === 1}
            onClick={() => {
              setPageNumber((page) => Number(page) - 1);
              paginate(currentPage - 1);
            }}
            type="button"
          >
            <Icon name="chevron-down" />
          </Button>
          <strong>Page </strong>
          <div
            className={classNames("p-form__group p-form-validation", {
              "is-error": error,
            })}
          >
            <div
              className={classNames("p-form__control", classes.inputWrapper, {
                [classes.withError]: error,
              })}
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
                  }
                )}
                onBlur={() => {
                  setPageNumber(currentPage);
                  setError("");
                }}
                onChange={(e) => {
                  if (e.target.value) {
                    setPageNumber(e.target.valueAsNumber);
                    if (
                      e.target.valueAsNumber > totalPages ||
                      e.target.valueAsNumber < 1
                    ) {
                      setError(
                        `"${e.target.valueAsNumber}" is not a valid page number.`
                      );
                    } else {
                      setError("");
                      paginate(e.target.valueAsNumber);
                    }
                  } else {
                    setPageNumber("");
                    setError("Enter a page number.");
                  }
                }}
                required
                type="number"
                value={pageNumber}
              />
              {error && (
                <p
                  className={classNames(
                    "p-form-validation__message u-no-margin--bottom",
                    classes.error
                  )}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
          <strong className={classes.noWrap}>of {totalPages}</strong>
          <Button
            aria-label={Label.NextPage}
            appearance="link"
            className="p-pagination__link--next u-no-margin--bottom"
            disabled={currentPage === totalPages}
            onClick={() => {
              setPageNumber((page) => Number(page) + 1);
              paginate(currentPage + 1);
            }}
            type="button"
          >
            <Icon name="chevron-down" />
          </Button>
        </span>
      </nav>
      <Select
        label="Machines per page"
        labelClassName="u-off-screen"
        className="u-no-margin--bottom"
        options={[
          { label: "20 / page", value: 20 },
          { label: "50 / page", value: 50 },
          { label: "100 / page", value: 100 },
        ]}
        value={itemsPerPage}
        onChange={(event) => {
          setItemsPerPage(parseInt(event.target.value));
        }}
      />
    </div>
  );
};

export default TablePagination;
