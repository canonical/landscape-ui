import classNames from "classnames";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import {
  UpgradeInstancePackagesParams,
  usePackages,
} from "@/features/packages";
import { Instance } from "@/types/Instance";
import AffectedPackages from "../AffectedPackages";
import { handleCellProps } from "./helpers";
import classes from "./InstancesPanel.module.scss";
import { InstancePackage } from "@/types/Package";

interface InstancesPanelProps {
  excludedPackages: UpgradeInstancePackagesParams[];
  instances: Instance[];
  onExcludedPackagesChange: (
    newExcludedPackages: UpgradeInstancePackagesParams[],
  ) => void;
}

const InstancesPanel: FC<InstancesPanelProps> = ({
  excludedPackages,
  instances,
  onExcludedPackagesChange,
}) => {
  const [tableLimit, setTableLimit] = useState(5);
  const [expandedRow, setExpandedRow] = useState(-1);
  const [packages, setPackages] = useState<InstancePackage[]>([]);
  const [offset, setOffset] = useState(0);

  const totalPackageCountRef = useRef(0);
  const offsetRef = useRef(-1);

  const { getInstancePackagesQuery } = usePackages();

  const {
    data: getInstancePackagesResult,
    isLoading: getInstancePackagesLoading,
  } = getInstancePackagesQuery(
    {
      instance_id: instances[expandedRow]?.id,
      limit: 5,
      offset,
      upgrade: true,
    },
    {
      enabled: expandedRow > -1,
    },
  );

  useEffect(() => {
    if (!getInstancePackagesResult || offset === offsetRef.current) {
      return;
    }

    offsetRef.current = offset;
    totalPackageCountRef.current = getInstancePackagesResult.data.count;
    setPackages((prevState) => [
      ...prevState,
      ...getInstancePackagesResult.data.results,
    ]);
  }, [getInstancePackagesResult]);

  const handleExpandCellClick = (index: number) => {
    setOffset(0);
    setPackages([]);
    setExpandedRow((prevState) => {
      if (prevState === index) {
        return -1;
      }

      return prevState > -1 && prevState < index ? index - 1 : index;
    });
  };

  const instanceData = useMemo(
    () =>
      expandedRow > -1
        ? [
            ...instances.slice(0, expandedRow + 1),
            ...instances.slice(expandedRow, tableLimit),
          ]
        : instances.slice(0, tableLimit),
    [instances, tableLimit, expandedRow],
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "title",
        className: classes.nameColumn,
        Header: "Name",
        Cell: ({ row: { index, original } }: CellProps<Instance>) => {
          if (expandedRow === -1 || index !== expandedRow + 1) {
            return original.title;
          }

          return (
            <AffectedPackages
              excludedPackages={excludedPackages}
              instance={original}
              onExcludedPackagesChange={onExcludedPackagesChange}
              onLimitChange={() => setOffset((prevState) => prevState + 5)}
              packages={packages}
              packagesCount={totalPackageCountRef.current}
              packagesLoading={getInstancePackagesLoading}
            />
          );
        },
      },
      {
        accessor: "upgrades",
        Header: "Affected packages",
        Cell: ({ row: { index, original } }: CellProps<Instance>) => (
          <Button
            type="button"
            className={classNames("p-accordion__tab", classes.expandButton)}
            aria-expanded={expandedRow === index}
            onClick={() => handleExpandCellClick(index)}
          >
            {(original.upgrades?.regular ?? 0) +
              (original.upgrades?.security ?? 0)}
          </Button>
        ),
      },
    ],
    [
      excludedPackages,
      expandedRow,
      getInstancePackagesLoading,
      packages,
      instanceData.length,
    ],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={instanceData}
      getCellProps={handleCellProps(expandedRow)}
      itemNames={{ plural: "instances", singular: "instance" }}
      onLimitChange={() => setTableLimit((prevState) => prevState + 5)}
      totalCount={instances.length}
    />
  );
};

export default InstancesPanel;
