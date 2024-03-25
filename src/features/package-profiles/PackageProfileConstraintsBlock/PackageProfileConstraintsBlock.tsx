import { FormikContextType } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  Icon,
  ModularTable,
  Select,
} from "@canonical/react-components";
import CellInput from "@/components/layout/CellInput";
import {
  CONSTRAINT_OPTIONS,
  CONSTRAINT_RULE_OPTIONS,
} from "@/features/package-profiles/constants";
import {
  AddFormProps,
  Constraint,
  ConstraintsEditFormProps,
  DuplicateFormProps,
} from "@/features/package-profiles/types";
import { EMPTY_CONSTRAINT, TOUCHED_CONSTRAINT } from "./constants";
import {
  getCellProps,
  getConstraintsErrorByIndex,
  handleConstraintRuleChange,
  handleConstraintVersionChange,
} from "./helpers";
import classes from "./PackageProfileConstraintsBlock.module.scss";
import useNotify from "@/hooks/useNotify";

interface PackageProfileConstraintsBlockProps {
  formik:
    | FormikContextType<AddFormProps>
    | FormikContextType<ConstraintsEditFormProps>
    | FormikContextType<DuplicateFormProps>;
}

const PackageProfileConstraintsBlock: FC<
  PackageProfileConstraintsBlockProps
> = ({ formik }) => {
  const [isApiErrorCleaned, setIsApiErrorCleaned] = useState(false);

  const { notify } = useNotify();

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

  useEffect(() => {
    if (isApiErrorCleaned || formik.values.constraints.length === 0) {
      return;
    }

    notify.clear();
    setIsApiErrorCleaned(true);
  }, [formik.values.constraints]);

  const constraintsData = useMemo(
    () => formik.values.constraints,
    [formik.values.constraints],
  );

  const columns = useMemo<Column<Constraint>[]>(
    () => [
      {
        accessor: "constraint",
        Header: "Constraint",
        Cell: ({ row: { original, index } }: CellProps<Constraint>) => {
          return (
            <Select
              label="Constraint"
              labelClassName="u-off-screen"
              className={classes.input}
              wrapperClassName={classes.inputWrapper}
              options={CONSTRAINT_OPTIONS}
              {...formik.getFieldProps(`constraints[${index}].constraint`)}
              value={original.constraint}
              error={getConstraintsErrorByIndex(formik, index, "constraint")}
            />
          );
        },
      },
      {
        accessor: "package",
        Header: "Package",
        Cell: ({ row: { original, index } }: CellProps<Constraint>) => (
          <CellInput
            placeholder="Package name"
            label="Package name"
            labelClassName="u-off-screen"
            className={classes.input}
            wrapperClassName={classes.inputWrapper}
            {...formik.getFieldProps(`constraints[${index}].package`)}
            initialValue={original.package}
            onChange={(value) =>
              formik.setFieldValue(`constraints[${index}].package`, value)
            }
            error={getConstraintsErrorByIndex(formik, index, "package")}
          />
        ),
      },
      {
        accessor: "rule",
        Header: "Rule",
        Cell: ({ row: { original, index } }: CellProps<Constraint>) => (
          <Select
            label="Rule"
            labelClassName="u-off-screen"
            className={classes.input}
            wrapperClassName={classes.inputWrapper}
            {...formik.getFieldProps(`constraints[${index}].rule`)}
            options={CONSTRAINT_RULE_OPTIONS}
            value={original.rule}
            onChange={(event) =>
              handleConstraintRuleChange(formik, index, event.target.value)
            }
            error={getConstraintsErrorByIndex(formik, index, "rule")}
          />
        ),
      },
      {
        accessor: "version",
        Header: "Version",
        Cell: ({ row: { original, index } }: CellProps<Constraint>) => (
          <CellInput
            placeholder="Version"
            label="Version"
            labelClassName="u-off-screen"
            className={classes.input}
            wrapperClassName={classes.inputWrapper}
            {...formik.getFieldProps(`constraints[${index}].version`)}
            initialValue={original.version}
            onChange={(value) =>
              handleConstraintVersionChange(formik, index, value)
            }
            error={getConstraintsErrorByIndex(formik, index, "version")}
          />
        ),
      },
      {
        accessor: "action",
        className: classes.action,
        Cell: ({ row }: CellProps<Constraint>) => (
          <Button
            type="button"
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding"
            aria-label="Delete constraint row"
            onClick={async () => {
              await formik.setFieldValue(
                "constraints",
                formik.values.constraints.filter(
                  (_, index) => index !== row.index,
                ),
              );

              if (formik.touched.constraints) {
                await formik.setTouched({
                  ...formik.touched,
                  constraints: formik.touched.constraints.filter(
                    (_, index) => index !== row.index,
                  ),
                });
              }
            }}
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
  };

  return (
    <>
      <div className="u-align-text--right">
        <Button
          type="button"
          hasIcon
          className={classes.cta}
          onClick={handleConstraintAdd}
        >
          <Icon name="plus" />
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
