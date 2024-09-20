import classNames from "classnames";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Button } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import {
  InstancePackage,
  InstancePackagesToExclude,
  usePackages,
} from "@/features/packages";
import { Instance } from "@/types/Instance";
import AffectedPackages from "../AffectedPackages";
import { handleCellProps } from "./helpers";
import classes from "./InstancesPanel.module.scss";

interface InstancesPanelProps {
  excludedPackages: InstancePackagesToExclude[];
  instances: Instance[];
  onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
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
    if (!getInstancePackagesResult) {
      return;
    }

    totalPackageCountRef.current = getInstancePackagesResult.data.count;

    if (offset !== offsetRef.current) {
      offsetRef.current = offset;

      setPackages((prevState) => [
        ...prevState,
        ...getInstancePackagesResult.data.results,
      ]);
    } else {
      offsetRef.current = offset;

      setPackages((prevState) => [
        ...prevState.slice(
          0,
          -1 * getInstancePackagesResult.data.results.length,
        ),
        ...getInstancePackagesResult.data.results,
      ]);
    }
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
            {original.upgrades?.regular ?? original.upgrades?.security ?? 0}
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
