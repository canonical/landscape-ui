import { FC, useState } from "react";
import { Input, InputProps } from "@canonical/react-components";
import { FormikErrors } from "formik";

interface CellInputProps extends Omit<InputProps, "onChange"> {
  initialValue: string;
  onChange: (value: string) => Promise<void | FormikErrors<unknown>>;
}

const CellInput: FC<CellInputProps> = ({
  initialValue,
  onBlur,
  onChange,
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
      onBlur={async (event) => {
        await onChange(value);
        onBlur && onBlur(event);
      }}
    />
  );
};

export default CellInput;
