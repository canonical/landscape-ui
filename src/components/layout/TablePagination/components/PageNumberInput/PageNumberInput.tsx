import classNames from "classnames";
import React, { useEffect, useState } from "react";
import classes from "./PageNumberInput.module.scss";
import { Input } from "@canonical/react-components";

const MEDIUM_INPUT_THRESHOLD = 9;
const LARGE_INPUT_THRESHOLD = 99;
const XLARGE_INPUT_THRESHOLD = 999;

const PageNumberInput = ({
  currentPage,
  max,
  min,
  setCurrentPage,
  name,
}: {
  readonly currentPage: number;
  readonly max: number;
  readonly min: number;
  readonly setCurrentPage: (page: number) => void;
  readonly name?: string;
}) => {
  const [error, setError] = useState("");
  const [page, setPage] = useState<number | "">(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const clearError = () => {
    setError("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.key === "Enter" && !error) {
      setCurrentPage(event.currentTarget.valueAsNumber);
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    if (!error) {
      setCurrentPage(event.target.valueAsNumber);
    } else {
      setPage(currentPage);
      clearError();
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const pageNumber = event.target.valueAsNumber;

    if (isNaN(pageNumber)) {
      setPage("");
      setError("Enter a page number.");
      return;
    }

    setPage(pageNumber);

    if (event.target.validity.valid) {
      clearError();
    } else {
      setError(`"${event.target.value}" is not a valid page number.`);
    }
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
        <Input
          aria-label="page number"
          className={classNames(
            "p-form-validation__input p-pagination__input u-no-margin--bottom",
            classes.input,
            {
              [classes.smallInput]: !currentPage || currentPage < 10,
              [classes.mediumInput]:
                currentPage && currentPage > MEDIUM_INPUT_THRESHOLD,
              [classes.largeInput]:
                currentPage && currentPage > LARGE_INPUT_THRESHOLD,
              [classes.xLargeInput]:
                currentPage && currentPage > XLARGE_INPUT_THRESHOLD,
            },
          )}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onChange={handleChange}
          required
          type="number"
          value={page}
          min={min}
          max={max}
          name={name}
          step={1}
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
