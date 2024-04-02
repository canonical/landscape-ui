import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import {
  AddFormProps,
  Constraint,
  ConstraintsFormProps,
} from "@/features/package-profiles/types";
import classes from "./PackageProfileConstraintsBlock.module.scss";
import { FormikContextType } from "formik";

const handleConstraintPropChange = async (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsFormProps>,
  index: number,
  prop: keyof Constraint,
  value: string,
) => {
  await formik.setFieldValue(`constraints[${index}]${[prop]}`, value);

  await formik.setFieldTouched(`constraints[${index}]${[prop]}`, true);

  if (!(["rule", "version"] as (keyof Constraint)[]).includes(prop)) {
    return;
  }

  if (value !== "") {
    await formik.setFieldValue(`constraints[${index}].notAnyVersion`, true);
  } else if (
    formik.values.constraints[index][prop === "rule" ? "version" : "rule"] ===
    ""
  ) {
    await formik.setFieldValue(`constraints[${index}].notAnyVersion`, false);
  }
};

const getConstraintsErrorByIndex = (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsFormProps>,
  index: number,
  key: keyof Constraint,
) => {
  if (
    !formik.errors.constraints?.[index] ||
    !formik.touched.constraints?.[index]?.[key]
  ) {
    return undefined;
  }

  const rowErrors = formik.errors.constraints[index];

  return typeof rowErrors !== "string" ? rowErrors[key] : undefined;
};

const handleConstraintRowDelete = async (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsFormProps>,
  rowIndex: number,
) => {
  await formik.setFieldValue(
    "constraints",
    formik.values.constraints.filter((_, index) => index !== rowIndex),
  );

  if (formik.touched.constraints) {
    formik.touched.constraints.splice(rowIndex, 1);

    await formik.setTouched({
      ...formik.touched,
      constraints: formik.touched.constraints,
    });
  }
};

export const getConstraintPropHandlers = (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsFormProps>,
) => {
  return {
    handleConstraintPropChange: async (
      index: number,
      prop: keyof Constraint,
      value: string,
    ) => {
      await handleConstraintPropChange(formik, index, prop, value);
    },
    handleConstraintRowDelete: async (rowIndex: number) => {
      await handleConstraintRowDelete(formik, rowIndex);
    },
    getConstraintsErrorByIndex: (index: number, key: keyof Constraint) => {
      return getConstraintsErrorByIndex(formik, index, key);
    },
  };
};

export const getCellProps = ({
  column,
}: Cell<Omit<Constraint, "id">>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  cellProps.className = classes.cell;

  if (column.id === "package_name") {
    cellProps.role = "rowheader";
  } else if (column.id === "action") {
    cellProps["aria-label"] = "Action";
  } else if (column.id === "constraint") {
    cellProps["aria-label"] = "Constraint";
  } else if (column.id === "version") {
    cellProps["aria-label"] = "Version";
  } else if (column.id === "rule") {
    cellProps["aria-label"] = "Rule";
  }

  return cellProps;
};
