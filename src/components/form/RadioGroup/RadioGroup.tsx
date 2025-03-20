import { RadioInput } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import classes from "./RadioGroup.module.scss";

interface RadioInputProps {
  label: string;
  value: string;
}

interface RadioGroupProps<
  TField extends string,
  TFormik extends Record<TField, string>,
> {
  readonly field: TField;
  readonly formik: FormikContextType<TFormik>;
  readonly inputs: RadioInputProps[];
  readonly label: string;
}

const RadioGroup = <
  TField extends string,
  TFormik extends Record<TField, string>,
>({
  field,
  formik,
  inputs,
  label,
}: RadioGroupProps<TField, TFormik>) => {
  return (
    <>
      <p className="u-no-margin--bottom">
        <strong>{label}</strong>
      </p>

      <div className={classes.radioGroup}>
        {inputs.map((input) => (
          <RadioInput
            key={input.value}
            label={input.label}
            {...formik.getFieldProps(field)}
            checked={formik.values[field] == input.value}
            onChange={async () => formik.setFieldValue(field, input.value)}
          />
        ))}
      </div>
    </>
  );
};

export default RadioGroup;
