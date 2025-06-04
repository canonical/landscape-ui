import EmptyState from "@/components/layout/EmptyState";
import ExpandableTableFooter from "@/components/layout/ExpandableTableFooter";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Activity, ActivityCommon } from "@/features/activities";
import { useActivities } from "@/features/activities";
import type { Package } from "@/features/packages";
import { usePackages } from "@/features/packages";
import { useUsns } from "@/features/usns";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Instance } from "@/types/Instance";
import type { Usn } from "@/types/Usn";
import {
  Button,
  Col,
  ConfirmationButton,
  ModularTable,
  Row,
  Tabs,
} from "@canonical/react-components";
import type { AxiosResponse } from "axios";
import classNames from "classnames";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { CellProps, Column } from "react-table";
import {
  MAX_ACTIVITY_COUNT,
  MAX_PACKAGE_COUNT,
  MAX_UPGRADE_COUNT,
  MAX_USN_COUNT,
} from "./constants";
import classes from "./InfoTablesContainer.module.scss";
import { pluralize } from "@/utils/_helpers";

const InfoTablesContainer: FC = () => {
  const [currentUpgradesTab, setCurrentUpgradesTab] = useState<
    "instances" | "packages" | "usns"
  >("instances");
  const [currentActivitiesTab, setCurrentActivitiesTab] = useState<
    "unapproved" | "inProgress"
  >("unapproved");

  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { getInstancesQuery } = useInstances();
  const { getPackagesQuery, upgradePackagesQuery } = usePackages();
  const { getUsnsQuery } = useUsns();
  const { getActivitiesQuery, approveActivitiesQuery } = useActivities();

  const { mutateAsync: upgradePackages, isPending: isUpgrading } =
    upgradePackagesQuery;
  const { mutateAsync: approveActivities, isPending: isApproving } =
    approveActivitiesQuery;

  const [packagesLimit, setPackagesLimit] = useState(MAX_PACKAGE_COUNT);
  const [usnsLimit, setUsnsLimit] = useState(MAX_USN_COUNT);

  const {
    data: unapprovedActivitiesRes = {
      data: { results: [] as Activity[], count: 0 },
    } as AxiosResponse<ApiPaginatedResponse<Activity>>,
    refetch: refetchUnapprovedActivities,
    isFetching: isFetchingUnapprovedActivitiesData,
  } = getActivitiesQuery({
    query: "status:unapproved",
    limit: MAX_ACTIVITY_COUNT,
  });

  const {
    data: inProgressActivitiesRes = {
      data: { results: [] as Activity[], count: 0 },
    } as AxiosResponse<ApiPaginatedResponse<Activity>>,
    refetch: refetchInProgressActivities,
    isFetching: isFetchingInProgressActivitiesData,
  } = getActivitiesQuery(
    {
      query: "status:delivered",
      limit: MAX_ACTIVITY_COUNT,
    },
    {
      enabled: currentActivitiesTab === "inProgress",
    },
  );

  const {
    data: instancesUpgradesRes = {
      data: { results: [] as Instance[], count: 0 },
    } as AxiosResponse<ApiPaginatedResponse<Instance>>,
    refetch: refetchInstanceUpgrades,
    isFetching: isFetchingInstanceUpgrades,
  } = getInstancesQuery({
    query: "alert:security-upgrades OR alert:package-upgrades",
    limit: MAX_UPGRADE_COUNT,
    with_upgrades: true,
  });

  const instancesData = instancesUpgradesRes.data.results;

  const {
    data: usnsData = {
      data: { results: [] as Usn[], count: 0 },
    } as AxiosResponse<ApiPaginatedResponse<Usn>>,
    refetch: refetchUsns,
    isFetching: isFetchingUsns,
  } = getUsnsQuery(
    {
      computer_ids: instancesData.map((instance) => instance.id),
      limit: usnsLimit,
    },
    {
      enabled: !!instancesData.length && currentUpgradesTab === "usns",
    },
  );
  const {
    data: packageDataRes = {
      data: { results: [] as Package[], count: 0 },
    } as AxiosResponse<ApiPaginatedResponse<Package>>,
    refetch: refetchPackages,
    isFetching: isFetchingPackages,
  } = getPackagesQuery(
    {
      query: instancesData.map((instance) => `id:${instance.id}`).join(" OR "),
      upgrade: true,
      limit: packagesLimit,
    },
    {
      enabled: !!instancesData.length && currentUpgradesTab === "packages",
    },
  );

  const packagesData = packageDataRes.data.results;
  const usnsUpgradesData = usnsData.data.results;
  const unapprovedActivitiesData = unapprovedActivitiesRes.data.results;
  const inProgressActivitiesData = inProgressActivitiesRes.data.results;

  const getTotalTableItemsCount = (
    table: "activities" | "upgrades",
  ): number => {
    if (table === "upgrades") {
      switch (currentUpgradesTab) {
        case "instances":
          return instancesUpgradesRes.data.count;
        case "packages":
          return packageDataRes.data.count;
        case "usns":
          return usnsData.data.count;
      }
    } else {
      switch (currentActivitiesTab) {
        case "unapproved":
          return unapprovedActivitiesRes.data.count;
        case "inProgress":
          return inProgressActivitiesRes.data.count;
      }
    }
  };

  const getUpgradesTableFooterName = (): string => {
    switch (currentUpgradesTab) {
      case "instances":
        return "instance";
      case "packages":
        return "package";
      case "usns":
        return "USN";
    }
  };

  const getUpgradesTableData = (): (Instance | Package | Usn)[] => {
    switch (currentUpgradesTab) {
      case "instances":
        return instancesData;
      case "packages":
        return packagesData;
      case "usns":
        return usnsUpgradesData;
    }
  };

  const getIsLoadingUpgrades = (): boolean => {
    switch (currentUpgradesTab) {
      case "instances":
        return isFetchingInstanceUpgrades;
      case "packages":
        return isFetchingPackages;
      case "usns":
        return isFetchingUsns;
    }
  };

  const upgradesTableData = useMemo(
    () => getUpgradesTableData(),
    [currentUpgradesTab, instancesData, packagesData, usnsUpgradesData],
  );

  const upgradesTableColumns = useMemo<
    Column<Instance | Package | Usn>[]
  >(() => {
    switch (currentUpgradesTab) {
      case "instances":
        return [
          {
            Header: "Instance Name",
            accessor: "instanceName",
            Cell: ({ row }: CellProps<Instance>): ReactNode => (
              <Link
                to={`/instances/${row.original.id}`}
                className={classNames("u-no-margin--bottom", classes.link)}
              >
                {row.original.title}
              </Link>
            ),
          },
          {
            Header: "Affected Packages",
            accessor: "upgrades",
            Cell: ({ row }: CellProps<Instance>): ReactNode => {
              const packageCount =
                (row.original.upgrades?.security ?? 0) +
                (row.original.upgrades?.regular ?? 0);

              return `${packageCount} ${pluralize(packageCount, "package")}`;
            },
            className: classes.lastCol,
          },
        ];
      case "packages":
        return [
          {
            Header: "Package Name",
            accessor: "name",
          },
          {
            Header: "Affected Instances",
            accessor: "computers",
            Cell: ({ row }: CellProps<Package>): ReactNode =>
              `${row.original.computers.length} ${pluralize(row.original.computers.length, "instance")}`,
            className: classes.lastCol,
          },
        ];
      case "usns":
        return [
          {
            Header: "USN",
            accessor: "usn",
          },
          {
            Header: "Affected Instances",
            accessor: "computers_count",
            Cell: ({ row }: CellProps<Usn>): ReactNode =>
              `${row.original.computers_count} ${pluralize(row.original.computers_count, "instance")}`,
            className: classes.lastCol,
          },
        ];
      default:
        return [];
    }
  }, [currentUpgradesTab]);

  const getActivitiesTableData = (): Activity[] => {
    switch (currentActivitiesTab) {
      case "unapproved":
        return unapprovedActivitiesData;
      case "inProgress":
        return inProgressActivitiesData;
      default:
        return [];
    }
  };

  const activitiesTableData = useMemo(
    () => getActivitiesTableData(),
    [currentActivitiesTab, unapprovedActivitiesData, inProgressActivitiesData],
  );

  const getIsLoadingActivities = (): boolean => {
    switch (currentActivitiesTab) {
      case "unapproved":
        return isFetchingUnapprovedActivitiesData;
      case "inProgress":
        return isFetchingInProgressActivitiesData;
      default:
        return false;
    }
  };

  const activitiesTableColumns = useMemo<Column<ActivityCommon>[]>(
    () => [
      {
        Header: "Description",
        accessor: "summary",
        className: classes.description,
        Cell: ({ row }: CellProps<ActivityCommon>): ReactNode => (
          <Link
            to="/activities"
            state={{ activity: row.original as Activity }}
            className={classNames("u-no-margin--bottom", classes.link)}
          >
            {row.original.summary}
          </Link>
        ),
      },
      {
        Header: "Creator",
        accessor: "creator.name",
        Cell: ({ row }: CellProps<ActivityCommon>): ReactNode => (
          <>{row.original.creator?.name ?? <NoData />}</>
        ),
      },
      {
        Header: "Created at",
        accessor: "creation_time",
        Cell: ({ row }: CellProps<ActivityCommon>): ReactNode => {
          const date = moment(row.original.creation_time);
          return (
            <span style={{ fontFamily: "monospace" }}>
              {date.local().format(DISPLAY_DATE_TIME_FORMAT)}
            </span>
          );
        },
      },
    ],
    [currentUpgradesTab],
  );

  const handleClickUpgradesTab = (tab: typeof currentUpgradesTab): void => {
    setCurrentUpgradesTab(tab);
  };

  const handleClickActivitiesTab = (tab: typeof currentActivitiesTab): void => {
    setCurrentActivitiesTab(tab);
  };

  const handleUpgradesRefresh = (): void => {
    switch (currentUpgradesTab) {
      case "instances":
        refetchInstanceUpgrades();
        break;
      case "packages":
        if (instancesData.length) {
          refetchPackages();
        }
        break;
      case "usns":
        if (instancesData.length) {
          refetchUsns();
        }
        break;
    }
  };

  const handleActivitiesRefresh = (): void => {
    switch (currentActivitiesTab) {
      case "unapproved":
        refetchUnapprovedActivities();
        break;
      case "inProgress":
        refetchInProgressActivities();
        break;
    }
  };

  const handleUpgradeAll = async (): Promise<void> => {
    const isSecurityOnly = currentUpgradesTab === "usns";
    try {
      await upgradePackages({
        query: instancesData
          .map((instance) => `id:${instance.id}`)
          .join(" OR "),
        security_only: isSecurityOnly,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleApproveActivities = async (): Promise<void> => {
    try {
      await approveActivities({
        query: "status:unapproved",
      });

      notify.success({
        message: "All activities have been approved successfully",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleUpgradesLimitChange = async () => {
    switch (currentUpgradesTab) {
      case "instances": {
        await navigate("/instances?status=package-upgrades");
        break;
      }

      case "packages": {
        setPackagesLimit((limit) => limit + 5);
        break;
      }

      case "usns": {
        setUsnsLimit((limit) => limit + 5);
        break;
      }
    }
  };

  const handleActivitiesLimitChange = async () => {
    switch (currentActivitiesTab) {
      case "unapproved": {
        await navigate("/activities?status=unapproved");
        break;
      }

      case "inProgress": {
        await navigate("/activities?status=delivered");
        break;
      }
    }
  };

  return (
    <Row
      className={classNames("u-no-padding u-no-max-width", classes.container)}
    >
      <Col size={6} className={classes.tableContainer}>
        <div className={classes.tableHeader}>
          <p className="p-heading--5 u-no-margin--bottom">Upgrades available</p>
          <ConfirmationButton
            type="button"
            className="is-small u-no-margin--bottom"
            disabled={!upgradesTableData.length}
            confirmationModalProps={{
              title: `Upgrade ${currentUpgradesTab === "usns" ? "USNs" : "packages"}`,
              children: (
                <p>
                  Are you sure you want to upgrade all{" "}
                  {currentUpgradesTab === "usns" ? "USNs" : "packages"}?
                </p>
              ),
              confirmButtonLabel: "Upgrade",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: isUpgrading,
              confirmButtonLoading: isUpgrading,
              onConfirm: handleUpgradeAll,
            }}
          >
            Upgrade all
          </ConfirmationButton>
        </div>
        <Tabs
          links={[
            {
              label: "Instances",
              role: "tab",
              active: "instances" === currentUpgradesTab,
              onClick: (): void => {
                handleClickUpgradesTab("instances");
              },
            },
            {
              label: "Packages",
              role: "tab",
              active: "packages" === currentUpgradesTab,
              onClick: (): void => {
                handleClickUpgradesTab("packages");
              },
            },
            {
              label: "USNs",
              role: "tab",
              active: "usns" === currentUpgradesTab,
              onClick: (): void => {
                handleClickUpgradesTab("usns");
              },
            },
          ]}
        />
        {getIsLoadingUpgrades() ? (
          <LoadingState />
        ) : !upgradesTableData.length ? (
          <EmptyState
            title="All instances are up to date."
            body="Your instances are up to date. Check back later for any new upgrades."
            cta={[
              <Button
                type="button"
                key="refresh"
                onClick={handleUpgradesRefresh}
              >
                Refresh
              </Button>,
            ]}
          />
        ) : (
          <>
            <ModularTable
              data={upgradesTableData}
              columns={upgradesTableColumns}
              className="u-no-margin--bottom"
            />
            {getTotalTableItemsCount("upgrades") > MAX_PACKAGE_COUNT && (
              <ExpandableTableFooter
                viewAll={currentUpgradesTab === "instances"}
                itemNames={{
                  singular: getUpgradesTableFooterName(),
                  plural: `${getUpgradesTableFooterName()}s`,
                }}
                itemCount={upgradesTableData.length}
                onLimitChange={handleUpgradesLimitChange}
                totalCount={getTotalTableItemsCount("upgrades")}
                className={classes.footer}
              />
            )}
          </>
        )}
      </Col>

      <Col size={6} className={classes.tableContainer}>
        <div className={classes.tableHeader}>
          <p className="p-heading--5 u-no-margin--bottom">Activities</p>
          {currentActivitiesTab === "unapproved" && (
            <ConfirmationButton
              className="is-small u-no-margin--bottom"
              type="button"
              disabled={!getTotalTableItemsCount("activities")}
              confirmationModalProps={{
                title: "Approve activities",
                children: (
                  <p>Are you sure you want to approve selected activities?</p>
                ),
                confirmButtonLabel: "Approve",
                confirmButtonAppearance: "positive",
                confirmButtonDisabled: isApproving,
                confirmButtonLoading: isApproving,
                onConfirm: handleApproveActivities,
              }}
            >
              Approve all
            </ConfirmationButton>
          )}
        </div>
        <Tabs
          links={[
            {
              label: "Requires approval",
              role: "tab",
              ["data-testid"]: "activities-requires-approval-tab",
              active: "unapproved" === currentActivitiesTab,
              onClick: (): void => {
                handleClickActivitiesTab("unapproved");
              },
            },
            {
              label: "In progress",
              role: "tab",
              ["data-testid"]: "activities-in-progress-tab",
              active: "inProgress" === currentActivitiesTab,
              onClick: (): void => {
                handleClickActivitiesTab("inProgress");
              },
            },
          ]}
        />
        {getIsLoadingActivities() ? (
          <LoadingState />
        ) : !activitiesTableData.length ? (
          <EmptyState
            title={
              currentActivitiesTab === "unapproved"
                ? "All activities have been approved."
                : "There are no activities in progress."
            }
            body={
              currentActivitiesTab === "unapproved"
                ? "There are currently no pending approval requests. Check back later for any new approval activities."
                : "There are currently no activities in progress. Check back later."
            }
            cta={[
              <Button
                type="button"
                key="refresh"
                onClick={handleActivitiesRefresh}
              >
                Refresh
              </Button>,
            ]}
          />
        ) : (
          <>
            <ModularTable
              data={activitiesTableData}
              columns={activitiesTableColumns}
              className="u-no-margin--bottom"
            />
            {getTotalTableItemsCount("activities") > MAX_ACTIVITY_COUNT && (
              <ExpandableTableFooter
                viewAll
                itemNames={{
                  singular: "activity",
                  plural: "activities",
                }}
                itemCount={MAX_ACTIVITY_COUNT}
                onLimitChange={handleActivitiesLimitChange}
                totalCount={getTotalTableItemsCount("activities")}
                className={classes.footer}
              />
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default InfoTablesContainer;
