import classNames from "classnames";
import { useEffect, useState } from "react";
import classes from "./PageNumberInput.module.scss";

const PageNumberInput = ({
  currentPage,
  max,
  min,
  setCurrentPage,
}: {
  currentPage: number;
  max: number;
  min: number;
  setCurrentPage: (page: number) => void;
}) => {
  const [error, setError] = useState("");
  const [page, setPage] = useState<number | "">(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const clearError = () => {
    setError("");
  };

  return (
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
            if (!event.target.value) {
              setError("Enter a page number.");
              setPage("");
              return;
            }

            setPage(event.target.valueAsNumber);

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
          }}
          required
          type="number"
          value={page}
          min={min}
          max={max}
        />

        {!!error && (
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
  );
};

export default PageNumberInput;
