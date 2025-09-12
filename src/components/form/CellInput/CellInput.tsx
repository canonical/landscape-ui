import type { FC } from "react";
import { useState } from "react";
import type { InputProps } from "@canonical/react-components";
import { Input } from "@canonical/react-components";
import type { FormikErrors } from "formik";

interface CellInputProps extends Omit<InputProps, "onBlur" | "onChange"> {
  readonly value: string;
  readonly onChange: (
    value: string,
  ) => Promise<void> | Promise<FormikErrors<unknown>>;
}

const CellInput: FC<CellInputProps> = ({
  onChange,
  value: initialValue,
  ...inputProps
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <Input
      type="text"
      autoComplete="off"
      {...inputProps}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onBlur={() => onChange(value)}
    />
  );
};

export default CellInput;
