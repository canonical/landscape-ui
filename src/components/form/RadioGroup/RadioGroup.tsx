import Indent from "@/components/layout/Indent";
import { RadioInput } from "@canonical/react-components";
import classNames from "classnames";
import type { FormikContextType } from "formik";
import type { ComponentProps, Key, ReactNode } from "react";
import classes from "./RadioGroup.module.scss";

interface RadioGroupProps<
  TField extends string,
  TValue,
  TFormik extends Record<TField, TValue>,
> {
  readonly field: TField;
  readonly formik: FormikContextType<TFormik>;
  readonly inputs?: (Omit<
    ComponentProps<typeof RadioInput>,
    | "checked"
    | "key"
    | "onChange"
    | keyof ReturnType<FormikContextType<TFormik>["getFieldProps"]>
  > & {
    value: TValue;
    key: Key;
    expansion?: ReactNode;
    help?: ReactNode;
    onSelect?: () => Promise<void> | void;
  })[];
  readonly label?: ReactNode;
}

const RadioGroup = <
  TField extends string,
  TValue,
  TFormik extends Record<TField, TValue>,
>({
  field,
  formik,
  inputs = [],
  label,
}: RadioGroupProps<TField, TValue, TFormik>) => {
  return (
    <>
      <p
        className={classNames(
          "u-no-margin--bottom p-heading--5",
          classes.label,
        )}
      >
        {label}
      </p>

      <div>
        {inputs.map(({ expansion, help, key, value, onSelect, ...input }) => {
          const checked = formik.values[field] == value;

          return (
            <div key={key}>
              <div className={help ? classes.noMargin : undefined}>
                <RadioInput
                  {...input}
                  {...formik.getFieldProps(field)}
                  checked={checked}
                  onChange={async () => {
                    await formik.setFieldValue(field, value);

                    if (onSelect) {
                      await onSelect();
                    }
                  }}
                />
              </div>

              {help && (
                <p
                  className={classNames(
                    classes.help,
                    "u-no-padding--top u-no-margin--bottom",
                  )}
                >
                  <small>{help}</small>
                </p>
              )}

              {checked && <Indent>{expansion}</Indent>}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RadioGroup;
