import classNames from "classnames";
import { FormikContextType } from "formik";
import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { Constraint } from "@/features/package-profiles/types";
import classes from "./PackageProfileConstraintsEditFormTable.module.scss";

const handleConstraintPropChange = async (
  formik: FormikContextType<Constraint>,
  prop: keyof Constraint,
  value: string,
) => {
  await formik.setFieldValue(`${prop}`, value);

  await formik.setFieldTouched(`${prop}`, true);

  if (!["rule", "version"].includes(`${prop}`)) {
    return;
  }

  if (value !== "") {
    await formik.setFieldValue(`notAnyVersion`, true);
  } else if (formik.values[prop === "rule" ? "version" : "rule"] === "") {
    await formik.setFieldValue(`notAnyVersion`, false);
  }
};

const getConstraintPropError = (
  formik: FormikContextType<Constraint>,
  prop: keyof Constraint,
) => {
  if (!formik.touched[prop] || !formik.errors[prop]) {
    return undefined;
  }

  return formik.errors[prop];
};

export const getConstraintPropHandlers = (
  formik: FormikContextType<Constraint>,
) => {
  return {
    handleConstraintPropChange: (prop: keyof Constraint, value: string) =>
      handleConstraintPropChange(formik, prop, value),
    getConstraintPropError: (prop: keyof Constraint) =>
      getConstraintPropError(formik, prop),
  };
};

export const getCellProps = (
  { column, row }: Cell<Constraint>,
  constraintId: number,
): Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  cellProps.className = classNames(classes.cell, {
    [classes.noPadding]: row.original.id === constraintId,
  });

  if (row.original.package === "loading") {
    if (column.id === "package") {
      cellProps.colSpan = 5;
    } else {
      cellProps.className = classes.hidden;
      cellProps["aria-hidden"] = true;
    }
  } else if (column.id === "package") {
    cellProps.role = "rowheader";
  } else if (column.id === "actions") {
    cellProps["aria-label"] = "Actions";
  } else if (column.id === "constraint") {
    cellProps["aria-label"] = "Constraint";
  } else if (column.id === "version") {
    cellProps["aria-label"] = "Version";
  } else if (column.id === "rule") {
    cellProps["aria-label"] = "Rule";
  }

  return cellProps;
};

export const getEmptyMessage = (filter: string, search: string) => {
  let message = "No constraints found";

  if (filter) {
    message += ` with the constraint type: "${filter}"`;

    if (search) {
      message += " and";
    }
  }

  if (search) {
    message += ` with the search: "${search}"`;
  }

  return message;
};
