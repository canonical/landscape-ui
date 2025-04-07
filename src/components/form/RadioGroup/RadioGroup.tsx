import { RadioInput } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ComponentProps, ReactNode } from "react";
import classes from "./RadioGroup.module.scss";

interface RadioGroupProps<
  TField extends string,
  TFormik extends Record<TField, ComponentProps<typeof RadioInput>["key"]>,
> {
  readonly field: TField;
  readonly formik: FormikContextType<TFormik>;
  readonly inputs?: (Omit<
    ComponentProps<typeof RadioInput>,
    | "checked"
    | "onChange"
    | keyof ReturnType<FormikContextType<TFormik>["getFieldProps"]>
  > & { value: ComponentProps<typeof RadioInput>["key"] })[];
  readonly label?: ReactNode;
}

const RadioGroup = <
  TField extends string,
  TFormik extends Record<TField, ComponentProps<typeof RadioInput>["key"]>,
>({
  field,
  formik,
  inputs = [],
  label,
}: RadioGroupProps<TField, TFormik>) => {
  return (
    <>
      <p className="u-no-margin--bottom">{label}</p>

      <div className={classes.radioGroup}>
        {inputs.map(({ value, ...input }) => (
          <RadioInput
            {...input}
            key={value}
            {...formik.getFieldProps(field)}
            checked={formik.values[field] == value}
            onChange={async () => formik.setFieldValue(field, value)}
          />
        ))}
      </div>
    </>
  );
};

export default RadioGroup;
