import { FormikContextType, FormikTouched } from "formik";
import { FC, useEffect, useMemo } from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  Icon,
  ModularTable,
  Select,
} from "@canonical/react-components";
import CellInput from "@/components/form/CellInput";
import {
  CONSTRAINT_OPTIONS,
  CONSTRAINT_RULE_OPTIONS,
  EMPTY_CONSTRAINT,
  TOUCHED_CONSTRAINT,
} from "../../constants";
import { AddFormProps, Constraint, ConstraintsFormProps } from "../../types";
import { getCellProps, getConstraintPropHandlers } from "./helpers";
import classes from "./PackageProfileConstraintsBlock.module.scss";

interface PackageProfileConstraintsBlockProps {
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsFormProps>;
}

const PackageProfileConstraintsBlock: FC<
  PackageProfileConstraintsBlockProps
> = ({ formik }) => {
  useEffect(() => {
    if (formik.submitCount === 0) {
      return;
    }

    (async () => {
      await formik.setTouched({
        ...formik.touched,
        constraints: new Array(formik.values.constraints.length).fill(
          TOUCHED_CONSTRAINT,
        ),
      });
    })();
  }, [formik.submitCount]);

  const constraintsData = useMemo(
    () => formik.values.constraints,
    [formik.values.constraints],
  );

  const {
    handleConstraintPropChange,
    handleConstraintRowDelete,
    getConstraintsErrorByIndex,
  } = getConstraintPropHandlers(formik);

  const columns = useMemo<Column<Omit<Constraint, "id">>[]>(
    () => [
      {
        accessor: "constraint",
        Header: "Constraint",
        Cell: ({ row: { index } }: CellProps<Omit<Constraint, "id">>) => {
          return (
            <Select
              label="Constraint"
              labelClassName="u-off-screen"
              className={classes.input}
              wrapperClassName={classes.inputWrapper}
              options={CONSTRAINT_OPTIONS}
              {...formik.getFieldProps(`constraints[${index}].constraint`)}
              onChange={(event) =>
                handleConstraintPropChange(
                  index,
                  "constraint",
                  event.target.value,
                )
              }
              error={getConstraintsErrorByIndex(index, "constraint")}
            />
          );
        },
      },
      {
        accessor: "package",
        Header: "Package",
        Cell: ({ row: { index } }: CellProps<Omit<Constraint, "id">>) => (
          <CellInput
            placeholder="Package name"
            label="Package name"
            labelClassName="u-off-screen"
            className={classes.input}
            wrapperClassName={classes.inputWrapper}
            {...formik.getFieldProps(`constraints[${index}].package`)}
            onChange={(value) =>
              handleConstraintPropChange(index, "package", value)
            }
            error={getConstraintsErrorByIndex(index, "package")}
          />
        ),
      },
      {
        accessor: "rule",
        Header: "Rule",
        Cell: ({ row: { index } }: CellProps<Omit<Constraint, "id">>) => (
          <Select
            label="Rule"
            labelClassName="u-off-screen"
            className={classes.input}
            wrapperClassName={classes.inputWrapper}
            {...formik.getFieldProps(`constraints[${index}].rule`)}
            options={CONSTRAINT_RULE_OPTIONS}
            onChange={(event) =>
              handleConstraintPropChange(index, "rule", event.target.value)
            }
            error={getConstraintsErrorByIndex(index, "rule")}
          />
        ),
      },
      {
        accessor: "version",
        Header: "Version",
        Cell: ({ row: { index } }: CellProps<Omit<Constraint, "id">>) => (
          <CellInput
            placeholder="Version"
            label="Version"
            labelClassName="u-off-screen"
            className={classes.input}
            wrapperClassName={classes.inputWrapper}
            {...formik.getFieldProps(`constraints[${index}].version`)}
            onChange={(value) =>
              handleConstraintPropChange(index, "version", value)
            }
            error={getConstraintsErrorByIndex(index, "version")}
          />
        ),
      },
      {
        accessor: "action",
        className: classes.action,
        Cell: ({ row }: CellProps<Omit<Constraint, "id">>) => (
          <Button
            type="button"
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding"
            aria-label="Delete constraint row"
            onClick={() => handleConstraintRowDelete(row.index)}
          >
            <Icon
              name="delete"
              className="u-no-margin--left u-no-margin--right"
            />
          </Button>
        ),
      },
    ],
    [constraintsData, formik.errors.constraints, formik.touched.constraints],
  );

  const handleConstraintAdd = async () => {
    await formik.setFieldValue("constraints", [
      EMPTY_CONSTRAINT,
      ...formik.values.constraints,
    ]);

    if (formik.touched.constraints) {
      const touchedConstraints: FormikTouched<Omit<Constraint, "id">>[] = [];

      for (let i = formik.values.constraints.length; i > 0; i--) {
        if (formik.touched.constraints[i - 1]) {
          touchedConstraints[i] = formik.touched.constraints[i - 1];
        }
      }

      await formik.setTouched({
        constraints: touchedConstraints,
      });
    }
  };

  return (
    <>
      <div className="u-align-text--right">
        <Button type="button" hasIcon onClick={handleConstraintAdd}>
          <Icon name="plus" className="u-no-margin--left" />
          <span>Add new constraint</span>
        </Button>
      </div>

      <ModularTable
        columns={columns}
        data={constraintsData}
        getCellProps={getCellProps}
        emptyMsg="No constraints added yet."
        className="u-no-margin--bottom"
      />

      {formik.touched.constraints &&
        typeof formik.errors.constraints === "string" && (
          <div className="is-error">
            <p className="p-form-validation__message u-no-margin--top">
              <strong>Error: </strong>
              <span>{formik.errors.constraints}</span>
            </p>
          </div>
        )}
    </>
  );
};

export default PackageProfileConstraintsBlock;
