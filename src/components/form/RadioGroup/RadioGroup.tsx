import { RadioInput } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ComponentProps, Key, ReactNode } from "react";

interface RadioGroupProps<
  TField extends string,
  TFormik extends Record<TField, Key>,
> {
  readonly field: TField;
  readonly formik: FormikContextType<TFormik>;
  readonly inputs?: (Omit<
    ComponentProps<typeof RadioInput>,
    | "checked"
    | "key"
    | "onChange"
    | keyof ReturnType<FormikContextType<TFormik>["getFieldProps"]>
  > & { key: Key })[];
  readonly label?: ReactNode;
}

const RadioGroup = <
  TField extends string,
  TFormik extends Record<TField, Key>,
>({
  field,
  formik,
  inputs = [],
  label,
}: RadioGroupProps<TField, TFormik>) => {
  return (
    <>
      <p className="u-no-margin--bottom">{label}</p>

      <div>
        {inputs.map(({ key, ...input }) => (
          <RadioInput
            {...input}
            key={key}
            {...formik.getFieldProps(field)}
            checked={formik.values[field] == key}
            onChange={async () => formik.setFieldValue(field, key)}
          />
        ))}
      </div>
    </>
  );
};

export default RadioGroup;
