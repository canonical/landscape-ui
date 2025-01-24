import classNames from "classnames";
import { useState } from "react";
import classes from "./PageNumberInputWithError.module.scss";
import PageNumberInput from "../PageNumberInput";

const PageNumberInputWithError = ({
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
        <PageNumberInput
          currentPage={currentPage}
          error={error}
          min={min}
          max={max}
          setCurrentPage={setCurrentPage}
          setError={setError}
        />

        <p
          className={classNames(
            "p-form-validation__message u-no-margin--bottom",
            classes.error,
          )}
        >
          {error}
        </p>
      </div>
    </div>
  );
};

export default PageNumberInputWithError;
