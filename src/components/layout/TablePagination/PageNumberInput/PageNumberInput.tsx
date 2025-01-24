import classNames from "classnames";
import { useEffect, useState } from "react";
import classes from "./PageNumberInput.module.scss";

const PageNumberInput = ({
  currentPage,
  error,
  max,
  min,
  setCurrentPage,
  setError,
}: {
  currentPage: number;
  error: string;
  max: number;
  min: number;
  setCurrentPage: (page: number) => void;
  setError: (error: string) => void;
}) => {
  const [page, setPage] = useState<number>(currentPage);

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  return (
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
      onKeyDown={(event) => {
        if (event.key === "Enter" && !error) {
          setCurrentPage(event.currentTarget.valueAsNumber);
        }
      }}
      onBlur={(event) => {
        if (!error) {
          setCurrentPage(event.target.valueAsNumber);
        } else {
          setPage(currentPage);
          clearError();
        }
      }}
      onChange={(event) => {
        setPage(event.target.valueAsNumber);

        if (event.target.value) {
          if (
            event.target.valueAsNumber > max ||
            event.target.valueAsNumber < min
          ) {
            setError(
              `"${event.target.valueAsNumber}" is not a valid page number.`,
            );
          } else {
            clearError();
          }
        } else {
          setError("Enter a page number.");
        }
      }}
      required
      type="number"
      value={page}
      min={min}
      max={max}
    />
  );
};

export default PageNumberInput;
