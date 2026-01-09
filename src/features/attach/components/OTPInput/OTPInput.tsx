import classNames from "classnames";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { OTP_LENGTH } from "../../constants";
import classes from "./OTPInput.module.scss";

interface OTPInputProps {
  readonly value: string[];
  readonly onChange: (value: string[]) => void;
  readonly onComplete: () => void;
  readonly error?: string;
}

const OTPInput: FC<OTPInputProps> = ({
  value,
  onChange,
  error,
  onComplete,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>(
    new Array(OTP_LENGTH).fill(null),
  );

  useEffect(() => {
    const nextIndex = value.findIndex((digit) => digit === "");
    const focusIndex = nextIndex === -1 ? OTP_LENGTH - 1 : nextIndex;
    inputsRef.current[focusIndex]?.focus();
  }, [value]);

  const handleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputElem = e.target;
      const rawValue = inputElem.value.replace(/[^A-Za-z0-9]/g, "");
      let newChar = rawValue;
      if (rawValue.length > 1) {
        const caretPos = inputElem.selectionStart;
        newChar =
          caretPos && caretPos > 0
            ? rawValue.charAt(caretPos - 1)
            : rawValue.slice(-1);
      }
      const newValue = [...value];
      newValue[index] = newChar;
      onChange(newValue);

      if (newValue.every((char) => char !== "")) {
        setTimeout(() => {
          onComplete();
        }, 0);
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    };

  const handlePaste =
    (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const paste = e.clipboardData
        .getData("text")
        .replace(/[^A-Za-z0-9]/g, "");

      if (!paste.length) {
        return;
      }

      const pastedChars = paste.split("");

      const combinedValue = [
        ...value.slice(0, index),
        ...pastedChars,
        ...value.slice(index + pastedChars.length),
      ].slice(0, OTP_LENGTH);

      const newValue = Object.assign(Array(OTP_LENGTH).fill(""), combinedValue);

      onChange(newValue);

      if (newValue.every((char) => char !== "")) {
        setTimeout(() => {
          onComplete();
        }, 0);
      }
    };

  return (
    <fieldset
      className={classNames("p-form__group p-form-validation", {
        "is-error": error,
      })}
      role="group"
      aria-labelledby="otp-label"
    >
      <legend id="otp-label">Code</legend>
      <div className="p-form__control u-clearfix">
        <div className={classes.otpContainer}>
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="text"
              className={classes.input}
              value={value[index] || ""}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste(index)}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="p-form-validation__message is-error" id="otp-error">
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default OTPInput;
