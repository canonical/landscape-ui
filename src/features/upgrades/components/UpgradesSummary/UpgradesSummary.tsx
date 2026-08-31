import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import type { PackageChangePlanSummaryItem } from "@/features/packages";
import {
  TargetState,
  useExecutePackageChangePlan,
  useGetPackageChangePlanSummary,
} from "@/features/packages";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import { getSelectionLabel, pluralize } from "@/utils/_helpers";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./UpgradesSummary.module.scss";
import useNotify from "@/hooks/useNotify";
import { useOpenActivityDetailsPanel } from "@/features/activities";

interface UpgradesSummaryProps {
  readonly packageChangePlanId: number;
  readonly onBackButtonPress?: () => void;
}

const UpgradesSummary: FC<UpgradesSummaryProps> = ({
  packageChangePlanId,
  onBackButtonPress,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { closeSidePanel } = useSidePanel();

  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const {
    data: summaryResponse,
    error: summaryError,
    isPending: isGettingSummary,
  } = useGetPackageChangePlanSummary(packageChangePlanId);

  const { mutateAsync: executeChangePlan, isPending: isExecutingChangePlan } =
    useExecutePackageChangePlan();

  const columns = useMemo<Column<PackageChangePlanSummaryItem>[]>(
    () => [
      {
        Header: "Package",
        Cell: ({
          row: { original: upgrade },
        }: CellProps<PackageChangePlanSummaryItem>) => upgrade.package_name,
      },
      {
        Header: "Upgrade version",
        Cell: ({
          row: { original: upgrade },
        }: CellProps<PackageChangePlanSummaryItem>) => upgrade.package_version,
      },
      {
        Header: "Affected instances",
        Cell: ({
          row: { original: upgrade },
        }: CellProps<PackageChangePlanSummaryItem>) =>
          pluralize(
            upgrade.package_state_counts.find(
              (stateCount) => stateCount.state === TargetState.APPLICABLE,
            )?.count ?? 0,
            ["instance"],
            "exact",
          ),
      },
    ],
    [],
  );

  if (summaryError) {
    throw summaryError;
  }

  if (isGettingSummary) {
    return <LoadingState />;
  }

  const items = summaryResponse.data.summary_items;
  const currentItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const submit = async () => {
    try {
      const { data: activity } = await executeChangePlan(packageChangePlanId);

      closeSidePanel();

      notify.success({
        title: `You queued ${getSelectionLabel(items, (item) => `package ${item.package_name}`, "packages")} to be upgraded.`,
        message: `${getSelectionLabel(items, (item) => `${item.package_name}`, "selected packages")} will be upgraded and ${pluralize(items.length, ["is", "are"])} queued in Activities.`,
        actions: [
          {
            label: "Details",
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

  return (
    <>
      <span className={classes.summary}>
        The following packages will be upgraded:
      </span>
      <ResponsiveTable columns={columns} data={currentItems} minWidth={512} />
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={items.length}
        currentItemCount={currentItems.length}
      />
      <SidePanelFormButtons
        hasBackButton={!!onBackButtonPress}
        onBackButtonPress={onBackButtonPress}
        submitButtonText={`Upgrade ${pluralize(items.length, ["package"], "exact")}`}
        submitButtonLoading={isExecutingChangePlan}
        onSubmit={submit}
      />
    </>
  );
};

export default UpgradesSummary;
