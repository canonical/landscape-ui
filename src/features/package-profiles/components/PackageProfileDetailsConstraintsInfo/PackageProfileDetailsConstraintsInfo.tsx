import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { ModularTable } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import {
  CONSTRAINT_OPTIONS,
  CONSTRAINT_RULE_OPTIONS,
  LOADING_CONSTRAINT,
} from "../../constants";
import { Constraint, PackageProfileConstraint } from "../../types";
import { getCellProps } from "./helpers";
import classes from "./PackageProfileDetailsConstraintsInfo.module.scss";

interface PackageProfileDetailsConstraintsInfoProps {
  isConstraintsLoading: boolean;
  profileConstraints: PackageProfileConstraint[] | undefined;
  search: string;
}

const PackageProfileDetailsConstraintsInfo: FC<
  PackageProfileDetailsConstraintsInfoProps
> = ({ isConstraintsLoading, profileConstraints, search }) => {
  const constraintsData = useMemo<Constraint[]>(() => {
    if (isConstraintsLoading) {
      return [LOADING_CONSTRAINT];
    }

    if (!profileConstraints) {
      return [];
    }

    return profileConstraints.map(
      (constraint): Constraint => ({
        ...constraint,
        notAnyVersion: !!constraint.version,
      }),
    );
  }, [isConstraintsLoading, profileConstraints]);

  const columns = useMemo<Column<Constraint>[]>(
    () => [
      {
        accessor: "constraint",
        className: classes.constraint,
        Header: "Constraint",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          CONSTRAINT_OPTIONS.find(({ value }) => value === original.constraint)
            ?.label ?? original.constraint,
      },
      {
        accessor: "package",
        Header: "Package",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          original.package === "loading" ? <LoadingState /> : original.package,
      },
      {
        accessor: "version",
        Header: "Version",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          original.version
            ? `${CONSTRAINT_RULE_OPTIONS.find(({ value }) => value === original.rule)?.label} ${original.version}`
            : "Any",
      },
    ],
    [constraintsData],
  );

  return (
    <ModularTable
      columns={columns}
      data={constraintsData}
      getCellProps={getCellProps}
      emptyMsg={`No constraints found with the search: "${search}"`}
    />
  );
};

export default PackageProfileDetailsConstraintsInfo;
