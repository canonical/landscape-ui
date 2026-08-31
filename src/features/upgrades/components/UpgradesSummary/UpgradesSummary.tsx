import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import type { Package } from "@/features/packages";
import { usePackages, useSearchUpgrades } from "@/features/packages";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import { pluralize } from "@/utils/_helpers";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./UpgradesSummary.module.scss";

interface UpgradesSummaryProps {
  readonly toggledUpgrades?: Package[];
  readonly isSelectAllUpgradesEnabled?: boolean;
  readonly search?: string;
  readonly query?: string;
  readonly onBackButtonPress?: () => void;
}

const UpgradesSummary: FC<UpgradesSummaryProps> = ({
  toggledUpgrades = [],
  isSelectAllUpgradesEnabled,
  search,
  query,
  onBackButtonPress,
}) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { upgradeInstancesPackagesQuery } = usePackages();
  const {
    mutateAsync: upgradeInstancesPackages,
    isPending: isUpgradingInstancesPackages,
  } = upgradeInstancesPackagesQuery;

  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const {
    data: upgradesResponse,
    isPending: isPendingUpgrades,
    error: upgradesError,
  } = useSearchUpgrades(
    {
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      computer_query: query ?? "",
      text: search,
    },
    {
      enabled: isSelectAllUpgradesEnabled,
    },
  );

  const columns = useMemo<Column<Package>[]>(
    () => [
      {
        Header: "Package",
        Cell: ({ row: { original: upgrade } }: CellProps<Package>) =>
          upgrade.name,
      },
      {
        Header: "Upgrade version",
        Cell: ({ row: { original: upgrade } }: CellProps<Package>) =>
          upgrade.version,
      },
      {
        Header: "Affected instances",
        Cell: ({ row: { original: upgrade } }: CellProps<Package>) =>
          pluralize(upgrade.computers.count, ["instance"], "exact"),
      },
    ],
    [query],
  );

  if (upgradesError) {
    throw upgradesError;
  }

  if (isPendingUpgrades) {
    return <LoadingState />;
  }

  const submit = async () => {
    try {
      await upgradeInstancesPackages({
        mode: isSelectAllUpgradesEnabled ? "exclude" : "include",
        query,
        packages: toggledUpgrades.map((upgrade) => upgrade.id),
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const upgradeCount = isSelectAllUpgradesEnabled
    ? upgradesResponse.data.count - toggledUpgrades.length
    : toggledUpgrades.length;

  return (
    <>
      <span className={classes.summary}>
        The following packages will be upgraded:
      </span>
      <ResponsiveTable
        columns={columns}
        data={
          isSelectAllUpgradesEnabled
            ? upgradesResponse.data.packages
            : toggledUpgrades
        }
        minWidth={512}
      />
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={upgradesResponse.data.count}
        currentItemCount={upgradesResponse.data.packages.length}
      />
      <SidePanelFormButtons
        hasBackButton={!!onBackButtonPress}
        onBackButtonPress={onBackButtonPress}
        submitButtonText={`Upgrade ${pluralize(upgradeCount, ["package"], "exact")}`}
        submitButtonLoading={isUpgradingInstancesPackages}
        onSubmit={submit}
      />
    </>
  );
};

export default UpgradesSummary;
