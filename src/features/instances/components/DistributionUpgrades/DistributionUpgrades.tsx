import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import { useCreateDistributionUpgrades } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize, pluralizeWithCount } from "@/utils/_helpers";
import {
  Button,
  CheckboxInput,
  Form,
  Icon,
  ModularTable,
  Notification,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column, Row } from "react-table";
import DistributionUpgradesViewInstancesModal from "./components/DistributionUpgradesViewInstancesModal";
import UpgradeConfirmationModal from "./components/UpgradeConfirmationModal";
import classes from "./DistributionUpgrades.module.scss";
import type { InstanceModalRow, TableRow } from "./types";
import { useDistributionUpgradesTableData } from "./useDistributionUpgradesTableData";
import LoadingState from "@/components/layout/LoadingState";
import { useBoolean } from "usehooks-ts";

export interface DistributionUpgradesProps {
  readonly selectedInstances: number[];
}

const DistributionUpgrades: FC<DistributionUpgradesProps> = ({
  selectedInstances,
}) => {
  const {
    value: showConfirmModal,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const [viewedCategory, setViewedCategory] = useState<{
    title: string;
    instances: InstanceModalRow[];
    isIneligibleCategory: boolean;
  } | null>(null);

  const [deselectedDistributions, setDeselectedDistributions] = useState<
    string[]
  >([]);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();

  const { isGettingDistributionUpgradeTargets, eligibleIds, tableData } =
    useDistributionUpgradesTableData(selectedInstances);

  const finalEligibleIds = useMemo(
    () =>
      tableData
        .flatMap((row) => row.subRows ?? [])
        .filter(
          (subRow) =>
            subRow.distributionKey !== undefined &&
            !deselectedDistributions.includes(subRow.distributionKey),
        )
        .flatMap((subRow) =>
          subRow.instances.map((instance) => instance.instanceId),
        ),
    [tableData, deselectedDistributions],
  );

  const { createDistributionUpgrades, isCreatingDistributionUpgrades } =
    useCreateDistributionUpgrades();

  const handleConfirm = async () => {
    try {
      const { data: activity } = await createDistributionUpgrades({
        computer_ids: finalEligibleIds,
      });

      closeModal();
      closeSidePanel();

      notify.success({
        title: `Distribution ${pluralize(finalEligibleIds.length, "upgrade")} queued`,
        message: `Distribution ${pluralize(finalEligibleIds.length, "upgrade")} for ${pluralizeWithCount(
          finalEligibleIds.length,
          "instance has",
          "instances have",
        )} been queued in Activities.`,
        actions: [
          {
            label: "View details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const columns = useMemo<Column<TableRow>[]>(
    () => [
      {
        Header: <>STATUS</>,
        accessor: "text",
        className: classes.statusColumn,
        Cell: ({ row }: CellProps<TableRow>) => {
          const depth = (row as Row<TableRow> & { depth?: number }).depth || 0;
          const isParent = depth === 0;
          const { distributionKey } = row.original;

          return (
            <div
              className={classNames(classes.statusCell, {
                [classes.parentStatusCell]: isParent,
                [classes.childStatusCell]: !isParent && !distributionKey,
                [classes.childStatusCheckboxCell]: !isParent && distributionKey,
              })}
            >
              {isParent && row.original.iconClass && (
                <Icon name={row.original.iconClass} />
              )}
              {distributionKey ? (
                <CheckboxInput
                  inline
                  labelClassName="u-no-margin--bottom"
                  label={<span>{row.original.text}</span>}
                  checked={!deselectedDistributions.includes(distributionKey)}
                  onChange={() => {
                    setDeselectedDistributions(
                      deselectedDistributions.includes(distributionKey)
                        ? deselectedDistributions.filter(
                            (k) => k !== distributionKey,
                          )
                        : [...deselectedDistributions, distributionKey],
                    );
                  }}
                />
              ) : (
                <span>{row.original.text}</span>
              )}
            </div>
          );
        },
      },
      {
        Header: <>INSTANCES</>,
        className: classes.countColumn,
        accessor: "count",
        Cell: ({ row }: CellProps<TableRow>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin"
            onClick={() => {
              setViewedCategory({
                title: row.original.text,
                instances: row.original.instances,
                isIneligibleCategory: row.original.instances.every(
                  (instance) => !eligibleIds.includes(instance.instanceId),
                ),
              });
            }}
          >
            {pluralizeWithCount(row.original.count, "instance")}
          </Button>
        ),
      },
    ],
    [eligibleIds, deselectedDistributions],
  );

  if (isGettingDistributionUpgradeTargets) {
    return <LoadingState />;
  }

  return (
    <Form noValidate onSubmit={openModal}>
      <Notification severity="caution" title="Warning">
        When upgrading distributions, misbehaved packages may require user input
        which can cause the upgrade to fail. Test the upgrade on a test system
        to ensure success. A reboot is required to complete this action.
      </Notification>

      <ModularTable columns={columns} data={tableData} />

      <SidePanelFormButtons
        submitButtonDisabled={
          isGettingDistributionUpgradeTargets ||
          isCreatingDistributionUpgrades ||
          finalEligibleIds.length === 0
        }
        submitButtonLoading={isCreatingDistributionUpgrades}
        submitButtonText="Upgrade distributions"
        onSubmit={openModal}
      />

      {showConfirmModal && (
        <UpgradeConfirmationModal
          onClose={closeModal}
          onConfirm={handleConfirm}
          eligibleCount={finalEligibleIds.length}
          isCreating={isCreatingDistributionUpgrades}
        />
      )}

      {viewedCategory && (
        <DistributionUpgradesViewInstancesModal
          category={viewedCategory}
          onClose={() => {
            setViewedCategory(null);
          }}
        />
      )}
    </Form>
  );
};

export default DistributionUpgrades;
