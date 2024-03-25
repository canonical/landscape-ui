import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import {
  AddFormProps,
  Constraint,
  ConstraintsEditFormProps,
  DuplicateFormProps,
} from "@/features/package-profiles/types";
import classes from "./PackageProfileConstraintsBlock.module.scss";
import { FormikContextType } from "formik";

export const handleConstraintRuleChange = async (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsEditFormProps>
    | FormikContextType<DuplicateFormProps>,
  index: number,
  value: string,
) => {
  await formik.setFieldValue(`constraints[${index}].rule`, value);

  if (value !== "") {
    await formik.setFieldValue(`constraints[${index}].notAnyVersion`, true);
  } else if (formik.values.constraints[index].version === "") {
    await formik.setFieldValue(`constraints[${index}].notAnyVersion`, false);
  }
};

export const handleConstraintVersionChange = async (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsEditFormProps>
    | FormikContextType<DuplicateFormProps>,
  index: number,
  value: string,
) => {
  await formik.setFieldValue(`constraints[${index}].version`, value);

  if (value !== "") {
    await formik.setFieldValue(`constraints[${index}].notAnyVersion`, true);
  } else if (formik.values.constraints[index].rule === "") {
    await formik.setFieldValue(`constraints[${index}].notAnyVersion`, false);
  }
};

export const getConstraintsErrorByIndex = (
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsEditFormProps>
    | FormikContextType<DuplicateFormProps>,
  index: number,
  key: keyof Constraint,
) => {
  if (
    !formik.errors.constraints?.[index] ||
    !formik.touched.constraints?.[index]
  ) {
    return undefined;
  }

  const rowErrors = formik.errors.constraints[index];

  return typeof rowErrors !== "string" ? rowErrors[key] : undefined;
};

export const getCellProps = ({
  column,
}: Cell<Constraint>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  cellProps.className = classes.cell;

  if (column.id === "package_name") {
    cellProps.role = "rowheader";
  } else if (column.id === "action") {
    cellProps["aria-label"] = "Action";
  } else if (column.id === "constraintsType") {
    cellProps["aria-label"] = "Constraint";
  } else if (column.id === "version") {
    cellProps["aria-label"] = "Version";
  } else if (column.id === "rule") {
    cellProps["aria-label"] = "Rule";
  }

  return cellProps;
};
