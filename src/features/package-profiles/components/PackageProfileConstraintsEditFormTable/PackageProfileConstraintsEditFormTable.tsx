import { FormikContextType } from "formik";
import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import {
  CheckboxInput,
  ModularTable,
  Select,
} from "@canonical/react-components";
import CellInput from "@/components/form/CellInput";
import LoadingState from "@/components/layout/LoadingState";
import PackageProfileConstraintsEditFormTableActions from "../PackageProfileConstraintsEditFormTableActions";
import {
  CONSTRAINT_OPTIONS,
  CONSTRAINT_RULE_OPTIONS,
  LOADING_CONSTRAINT,
} from "../../constants";
import { Constraint, PackageProfileConstraint } from "../../types";
import {
  getCellProps,
  getConstraintPropHandlers,
  getEmptyMessage,
} from "./helpers";
import classes from "./PackageProfileConstraintsEditFormTable.module.scss";

interface PackageProfileConstraintsEditFormTableProps {
  filter: string;
  formik: FormikContextType<Constraint>;
  isConstraintsLoading: boolean;
  onSelectedIdsChange: (value: number[]) => void;
  pageSize: number;
  profileConstraints: PackageProfileConstraint[] | undefined;
  search: string;
  selectedIds: number[];
}

const PackageProfileConstraintsEditFormTable: FC<
  PackageProfileConstraintsEditFormTableProps
> = ({
  filter,
  formik,
  isConstraintsLoading,
  onSelectedIdsChange,
  pageSize,
  profileConstraints,
  search,
  selectedIds,
}) => {
  const constraints = useMemo<Constraint[]>(() => {
    if (isConstraintsLoading) {
      return [LOADING_CONSTRAINT];
    }

    if (!profileConstraints) {
      return [];
    }

    const constraintsData = profileConstraints.map((constraint) => ({
      ...constraint,
      notAnyVersion: !!constraint.version,
    }));

    if (formik.values.id !== -1) {
      return constraintsData;
    }

    return [formik.values, ...constraintsData].slice(0, pageSize);
  }, [isConstraintsLoading, profileConstraints, formik.values, pageSize]);

  const handleToggleAllConstraints = () => {
    onSelectedIdsChange(
      selectedIds.length ? [] : constraints.map(({ id }) => id),
    );
  };

  const handleConstraintToggle = (constraintId: number) => {
    if (selectedIds.includes(constraintId)) {
      onSelectedIdsChange(selectedIds.filter((id) => id !== constraintId));
    } else {
      onSelectedIdsChange([...selectedIds, constraintId]);
    }
  };

  const { handleConstraintPropChange, getConstraintPropError } =
    getConstraintPropHandlers(formik);

  const columns = useMemo<Column<Constraint>[]>(
    () => [
      {
        accessor: "constraint",
        Header: () => (
          <div className={classes.checkboxContainer}>
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">Toggle all constraints</span>
              }
              labelClassName="u-no-margin--bottom u-no-padding--top"
              disabled={formik.values.id !== 0 || constraints.length === 0}
              checked={
                constraints.length > 0 &&
                constraints.length === selectedIds.length
              }
              indeterminate={
                selectedIds.length > 0 &&
                selectedIds.length < constraints.length
              }
              onChange={handleToggleAllConstraints}
            />
            <span>Constraint</span>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          formik.values.id === original.id ? (
            <Select
              label="Constraint"
              labelClassName="u-off-screen"
              className={classes.input}
              wrapperClassName={classes.inputWrapper}
              options={CONSTRAINT_OPTIONS}
              {...formik.getFieldProps(`constraint`)}
              onChange={(event) =>
                handleConstraintPropChange("constraint", event.target.value)
              }
              error={getConstraintPropError("constraint")}
            />
          ) : (
            <div className={classes.checkboxContainer}>
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">{`Toggle ${original.package} constraint`}</span>
                }
                labelClassName="u-no-margin--bottom u-no-padding--top"
                disabled={formik.values.id !== 0}
                checked={selectedIds.includes(original.id)}
                onChange={() => handleConstraintToggle(original.id)}
              />
              <span>{original.constraint}</span>
            </div>
          ),
      },
      {
        accessor: "package",
        Header: "Package",
        Cell: ({ row: { original } }: CellProps<Constraint>) => {
          if (formik.values.id === original.id) {
            return (
              <CellInput
                placeholder="Package name"
                label="Package name"
                labelClassName="u-off-screen"
                className={classes.input}
                wrapperClassName={classes.inputWrapper}
                {...formik.getFieldProps(`package`)}
                onChange={(value) =>
                  handleConstraintPropChange("package", value)
                }
                error={getConstraintPropError("package")}
              />
            );
          }

          if (original.package !== "loading") {
            return <>{original.package}</>;
          }

          return <LoadingState />;
        },
      },
      {
        accessor: "rule",
        Header: "Rule",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          formik.values.id === original.id ? (
            <Select
              label="Rule"
              labelClassName="u-off-screen"
              className={classes.input}
              wrapperClassName={classes.inputWrapper}
              options={CONSTRAINT_RULE_OPTIONS}
              {...formik.getFieldProps(`rule`)}
              onChange={(event) =>
                handleConstraintPropChange("rule", event.target.value)
              }
              error={getConstraintPropError("rule")}
            />
          ) : (
            <>
              {CONSTRAINT_RULE_OPTIONS.find(
                ({ value }) => value === original.rule,
              )?.label ?? original.rule}
            </>
          ),
      },
      {
        accessor: "version",
        Header: "Version",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          formik.values.id === original.id ? (
            <CellInput
              placeholder="Version"
              label="Version"
              labelClassName="u-off-screen"
              className={classes.input}
              wrapperClassName={classes.inputWrapper}
              {...formik.getFieldProps(`version`)}
              onChange={(value) => handleConstraintPropChange("version", value)}
              error={getConstraintPropError("version")}
            />
          ) : (
            <>{original.version}</>
          ),
      },
      {
        accessor: "actions",
        className: classes.actionsCell,
        Cell: ({ row: { original } }: CellProps<Constraint>) => (
          <PackageProfileConstraintsEditFormTableActions
            constraint={original}
            formik={formik}
          />
        ),
      },
    ],
    [constraints, selectedIds.length, formik.errors, formik.touched],
  );

  return (
    <ModularTable
      columns={columns}
      data={constraints}
      getCellProps={(cell) => getCellProps(cell, formik.values.id)}
      className="u-no-margin--bottom"
      emptyMsg={getEmptyMessage(filter, search)}
    />
  );
};

export default PackageProfileConstraintsEditFormTable;
