import { FC, useState } from "react";
import { Input, InputProps } from "@canonical/react-components";
import { FormikErrors } from "formik";

interface CellInputProps extends Omit<InputProps, "onBlur" | "onChange"> {
  value: string;
  onChange: (value: string) => Promise<void> | Promise<FormikErrors<unknown>>;
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
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => onChange(value)}
    />
  );
};

export default CellInput;
