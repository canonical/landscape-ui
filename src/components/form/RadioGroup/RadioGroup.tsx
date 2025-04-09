import Indent from "@/components/layout/Indent";
import { RadioInput } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ComponentProps, Key, ReactNode } from "react";
import classes from "./RadioGroup.module.scss";

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
  > & { key: Key; expansion?: ReactNode; help?: ReactNode })[];
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
        {inputs.map(({ expansion, help, key, ...input }) => {
          const checked = formik.values[field] == key;

          return (
            <>
              <div className={help ? classes.noMargin : undefined}>
                <RadioInput
                  {...input}
                  key={key}
                  {...formik.getFieldProps(field)}
                  checked={checked}
                  onChange={async () => formik.setFieldValue(field, key)}
                />
              </div>

              {help && <small className={classes.help}>{help}</small>}

              {checked && <Indent>{expansion}</Indent>}
            </>
          );
        })}
      </div>
    </>
  );
};

export default RadioGroup;
