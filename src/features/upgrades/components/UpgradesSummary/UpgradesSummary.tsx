import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { usePackages } from "@/features/packages";
import useDebug from "@/hooks/useDebug";
import useFetch from "@/hooks/useFetch";
import useSidePanel from "@/hooks/useSidePanel";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { pluralizeWithCount } from "@/utils/_helpers";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import type { GetPackageUpgradeParams } from "../../types/GetPackageUpgradeParams";
import type { PackageUpgrade } from "../../types/PackageUpgrade";
import type { PriorityOrSeverity } from "../../types/PriorityOrSeverity";
import AffectedInstancesLink from "../AffectedInstancesLink";
import classes from "./UpgradesSummary.module.scss";

interface UpgradesSummaryProps {
  readonly toggledUpgrades?: PackageUpgrade[];
  readonly isSelectAllUpgradesEnabled?: boolean;
  readonly priorities?: PriorityOrSeverity[];
  readonly severities?: PriorityOrSeverity[];
  readonly upgradeType?: string;
  readonly search?: string;
  readonly query?: string;
  readonly onBackButtonPress?: () => void;
}

const UpgradesSummary: FC<UpgradesSummaryProps> = ({
  toggledUpgrades = [],
  isSelectAllUpgradesEnabled,
  priorities,
  severities,
  upgradeType,
  search,
  query,
  onBackButtonPress,
}) => {
  const debug = useDebug();
  const authFetch = useFetch();
  const { closeSidePanel } = useSidePanel();

  const { upgradeInstancesPackagesQuery } = usePackages();
  const {
    mutateAsync: upgradeInstancesPackages,
    isPending: isUpgradingInstancesPackages,
  } = upgradeInstancesPackagesQuery;

  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const queryParams: GetPackageUpgradeParams = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
    priorities,
    severities,
    security_only: upgradeType === "security",
    search,
    query,
  };

  const {
    data: upgradesResponse,
    isPending: isPendingUpgrades,
    error: upgradesError,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<PackageUpgrade>>,
    AxiosError<ApiError>
  >({
    queryKey: ["packages/upgrades", queryParams],
    queryFn: async () =>
      authFetch.get("packages/upgrades", {
        params: queryParams,
      }),
    enabled: isSelectAllUpgradesEnabled,
  });

  const columns = useMemo<Column<PackageUpgrade>[]>(
    () => [
      {
        Header: "Package",
        Cell: ({ row: { original: upgrade } }: CellProps<PackageUpgrade>) =>
          upgrade.name,
      },
      {
        Header: "Affected instances",
        Cell: ({ row: { original: upgrade } }: CellProps<PackageUpgrade>) => (
          <AffectedInstancesLink upgrade={upgrade} query={query} />
        ),
      },
      {
        Header: "Current version",
        Cell: ({ row: { original: upgrade } }: CellProps<PackageUpgrade>) =>
          upgrade.versions.current,
      },
      {
        Header: "New version",
        Cell: ({ row: { original: upgrade } }: CellProps<PackageUpgrade>) =>
          upgrade.versions.newest,
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
        security_only: upgradeType === "security",
        priorities,
        severities,
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
        {pluralizeWithCount(upgradeCount, "package upgrade")} will be applied.
      </span>
      <ResponsiveTable
        columns={columns}
        data={
          isSelectAllUpgradesEnabled
            ? upgradesResponse.data.results
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
        currentItemCount={upgradesResponse.data.results.length}
      />
      <SidePanelFormButtons
        hasBackButton={!!onBackButtonPress}
        onBackButtonPress={onBackButtonPress}
        submitButtonText={`Upgrade ${pluralizeWithCount(upgradeCount, "package")}`}
        submitButtonLoading={isUpgradingInstancesPackages}
        onSubmit={submit}
      />
    </>
  );
};

export default UpgradesSummary;
