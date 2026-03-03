import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import { useCreateDistributionUpgrades } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize } from "@/utils/_helpers";
import {
  Button,
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

export interface DistributionUpgradesProps {
  readonly selectedInstances: number[];
}

const DistributionUpgrades: FC<DistributionUpgradesProps> = ({
  selectedInstances,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [viewedCategory, setViewedCategory] = useState<{
    title: string;
    instances: InstanceModalRow[];
    isIneligibleCategory: boolean;
  } | null>(null);

  const { isGettingDistributionUpgradeTargets, eligibleIds, tableData } =
    useDistributionUpgradesTableData(selectedInstances);

  const eligibleIdSet = useMemo(() => new Set(eligibleIds), [eligibleIds]);

  const { createDistributionUpgrades, isCreatingDistributionUpgrades } =
    useCreateDistributionUpgrades();

  const handleSubmitForm = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (!eligibleIds.length) {
      return;
    }

    try {
      const { data: activity } = await createDistributionUpgrades({
        computer_ids: eligibleIds,
      });

      closeSidePanel();

      notify.success({
        title: "Distribution upgrades queued",
        message: `Distribution upgrades for ${eligibleIds.length} ${pluralize(
          eligibleIds.length,
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

          return (
            <div
              className={classNames(classes.statusCell, {
                [classes.parentStatusCell]: isParent,
                [classes.childStatusCell]: !isParent,
              })}
            >
              {isParent && row.original.iconClass && (
                <Icon name={row.original.iconClass} />
              )}
              <span>{row.original.text}</span>
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
                  (instance) => !eligibleIdSet.has(instance.instanceId),
                ),
              });
            }}
          >
            {row.original.count} {pluralize(row.original.count, "instance")}
          </Button>
        ),
      },
    ],
    [eligibleIdSet],
  );

  if (isGettingDistributionUpgradeTargets) {
    return <LoadingState />;
  }

  return (
    <Form noValidate onSubmit={handleSubmitForm}>
      <Notification severity="caution" title="Warning">
        When upgrading distributions, misbehaved packages may require user input
        which can cause the upgrade to fail. Test the upgrade on a test system
        to ensure success. A reboot is required to complete this action.
      </Notification>

      <div style={{ marginTop: 12 }}>
        <ModularTable columns={columns} data={tableData} />
      </div>

      <SidePanelFormButtons
        submitButtonDisabled={
          isGettingDistributionUpgradeTargets ||
          isCreatingDistributionUpgrades ||
          eligibleIds.length === 0
        }
        submitButtonLoading={isCreatingDistributionUpgrades}
        submitButtonText="Upgrade distributions"
        onSubmit={handleSubmitForm}
      />

      {showConfirmModal && (
        <UpgradeConfirmationModal
          onClose={() => {
            setShowConfirmModal(false);
          }}
          onConfirm={handleConfirm}
          eligibleCount={eligibleIds.length}
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
