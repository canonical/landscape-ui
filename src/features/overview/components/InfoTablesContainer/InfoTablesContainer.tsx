import EmptyState from "@/components/layout/EmptyState";
import ExpandableTableFooter from "@/components/layout/ExpandableTableFooter";
import { DISPLAY_DATE_TIME_FORMAT, ROOT_PATH } from "@/constants";
import { Activity, ActivityCommon, useActivities } from "@/features/activities";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { usePackages } from "@/hooks/usePackages";
import useUsns from "@/hooks/useUsns";
import { OldPackage } from "@/types/Package";
import {
  Button,
  Col,
  ModularTable,
  Row,
  Tabs,
} from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import { FC, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CellProps, Column } from "react-table";
import classes from "./InfoTablesContainer.module.scss";
import { Usn } from "@/types/Usn";
import useNotify from "@/hooks/useNotify";
import LoadingState from "@/components/layout/LoadingState";
import { Instance } from "@/types/Instance";
import NoData from "@/components/layout/NoData";

interface InfoTablesContainerProps {}

const InfoTablesContainer: FC<InfoTablesContainerProps> = () => {
  const [currentUpgradesTab, setCurrentUpgradesTab] = useState(0);
  const [currentActivitiesTab, setCurrentActivitiesTab] = useState(0);

  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { getInstancesQuery } = useInstances();
  const { getPackagesQuery, upgradePackagesQuery } = usePackages();
  const { getUsnsQuery } = useUsns();
  const { getActivitiesQuery, approveActivitiesQuery } = useActivities();

  const { mutateAsync: upgradePackages } = upgradePackagesQuery;
  const { mutateAsync: approveActivities } = approveActivitiesQuery;

  const {
    data: unapprovedActivitiesRes,
    refetch: refetchUnapprovedActivities,
    isLoading: isLoadingUnapprovedActivitiesData,
  } = getActivitiesQuery({
    query: "status:unapproved",
    limit: 10,
  });

  const {
    data: inProgressActivitiesRes,
    refetch: refetchInProgressActivities,
    isLoading: isLoadingInProgressActivitiesData,
  } = getActivitiesQuery({
    query: "status:delivered",
    limit: 10,
  });

  const {
    data: instancesUpgradesRes,
    refetch: refetchInstanceUpgrades,
    isLoading: isLoadingInstanceUpgrades,
  } = getInstancesQuery({
    query: "alert:security-upgrades OR alert:package-upgrades",
    limit: 10,
    with_upgrades: true,
  });

  const instancesData = instancesUpgradesRes?.data.results ?? [];

  const {
    data: usnsData,
    refetch: refetchUsns,
    isLoading: isLoadingUsns,
  } = getUsnsQuery(
    {
      computer_ids: instancesData.map((instance) => instance.id),
      limit: 11,
    },
    {
      enabled: instancesData.length > 0,
    },
  );
  const {
    data: packageDataRes,
    refetch: refetchPackages,
    isLoading: isLoadingPackages,
  } = getPackagesQuery(
    {
      query: instancesData.map((instance) => `id:${instance.id}`).join(" OR "),
      upgrade: true,
      limit: 10,
    },
    {
      enabled: instancesData.length > 0,
    },
  );

  const packagesData = packageDataRes?.data.results ?? [];
  const usnsUpgradesData = usnsData?.data.results ?? [];
  const unapprovedActivitiesData = unapprovedActivitiesRes?.data.results ?? [];
  const inProgressActivitiesData = inProgressActivitiesRes?.data.results ?? [];

  const getTotalTableItemsCount = (table: "activities" | "upgrades") => {
    if (table === "upgrades") {
      switch (currentUpgradesTab) {
        case 0:
          return instancesUpgradesRes?.data.count ?? 0;
        case 1:
          return packageDataRes?.data.count ?? 0;
        case 2:
          return usnsData?.data.count ?? 0;
        default:
          return 0;
      }
    } else {
      switch (currentActivitiesTab) {
        case 0:
          return unapprovedActivitiesRes?.data.count ?? 0;
        case 1:
          return inProgressActivitiesRes?.data.count ?? 0;
        default:
          return 0;
      }
    }
  };

  const getUpgradesTableFooterName = () => {
    switch (currentUpgradesTab) {
      case 0:
        return "instance";
      case 1:
        return "package";
      default:
        return "USN";
    }
  };

  const getUpgradesTableData = () => {
    switch (currentUpgradesTab) {
      case 0:
        return instancesData;
      case 1:
        return packagesData;
      case 2:
        return usnsUpgradesData;
      default:
        return [];
    }
  };

  const getIsLoadingUpgrades = () => {
    switch (currentUpgradesTab) {
      case 0:
        return isLoadingInstanceUpgrades;
      case 1:
        return isLoadingPackages;
      case 2:
        return isLoadingUsns;
      default:
        return false;
    }
  };

  const upgradesTableData = useMemo(
    () => getUpgradesTableData(),
    [currentUpgradesTab, instancesData, packagesData, usnsUpgradesData],
  );

  const upgradesTableColumns = useMemo<
    Column<Instance | OldPackage | Usn>[]
  >(() => {
    switch (currentUpgradesTab) {
      case 0:
        return [
          {
            Header: "Instance Name",
            accessor: "instanceName",
            Cell: ({ row }: CellProps<Instance>) => (
              <Link
                to={`${ROOT_PATH}instances/${row.original.id}`}
                className={classNames("u-no-margin--bottom", classes.link)}
              >
                {row.original.title}
              </Link>
            ),
          },
          {
            Header: "Affected Packages",
            accessor: "upgrades",
            Cell: ({ row }: CellProps<Instance>) => (
              <>
                {(row.original.upgrades?.security ?? 0) +
                  (row.original.upgrades?.regular ?? 0)}
              </>
            ),
            className: classes.lastCol,
          },
        ];
      case 1:
        return [
          {
            Header: "Package Name",
            accessor: "name",
          },
          {
            Header: "Affected Instances",
            accessor: "computers",
            Cell: ({ row }: CellProps<OldPackage>) => (
              <Link
                to={`${ROOT_PATH}instances`}
                className={classNames("u-no-margin--bottom", classes.link)}
              >
                {row.original.computers.length}
              </Link>
            ),
            className: classes.lastCol,
          },
        ];
      case 2:
        return [
          {
            Header: "USN",
            accessor: "usn",
          },
          {
            Header: "Affected Instances",
            accessor: "computers_count",
            Cell: ({ row }: CellProps<Usn>) => (
              <Link
                to={`${ROOT_PATH}instances`}
                className={classNames("u-no-margin--bottom", classes.link)}
              >
                {row.original.computers_count}
              </Link>
            ),
            className: classes.lastCol,
          },
        ];
      default:
        return [];
    }
  }, [currentUpgradesTab]);

  const getActivitiesTableData = () => {
    switch (currentActivitiesTab) {
      case 0:
        return unapprovedActivitiesData;
      case 1:
        return inProgressActivitiesData;
      default:
        return [];
    }
  };

  const activitiesTableData = useMemo(
    () => getActivitiesTableData(),
    [currentActivitiesTab, unapprovedActivitiesData, inProgressActivitiesData],
  );

  const getIsLoadingActivities = () => {
    switch (currentActivitiesTab) {
      case 0:
        return isLoadingUnapprovedActivitiesData;
      case 1:
        return isLoadingInProgressActivitiesData;
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
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <Link
            to={`${ROOT_PATH}activities`}
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
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <>{row.original.creator?.name ?? <NoData />}</>
        ),
      },
      {
        Header: "Created at",
        accessor: "creation_time",
        Cell: ({ row }: CellProps<ActivityCommon>) => {
          const date = moment(row.original.creation_time);
          return <>{date.local().format(DISPLAY_DATE_TIME_FORMAT)}</>;
        },
      },
    ],
    [currentUpgradesTab],
  );

  const handleClickUpgradesTab = (tabIndex: number) => {
    setCurrentUpgradesTab(tabIndex);
  };

  const handleClickActivitiesTab = (tabIndex: number) => {
    setCurrentActivitiesTab(tabIndex);
  };

  const handleUpgradesRefresh = () => {
    switch (currentUpgradesTab) {
      case 0:
        refetchInstanceUpgrades();
        break;
      case 1:
        refetchPackages();
        break;
      case 2:
        refetchUsns();
        break;
    }
  };

  const handleActivitiesRefresh = () => {
    switch (currentActivitiesTab) {
      case 0:
        refetchUnapprovedActivities();
        break;
      case 1:
        refetchInProgressActivities();
        break;
    }
  };

  const handleUpgradeAll = async () => {
    const isSecurityOnly = currentUpgradesTab === 2;
    try {
      await upgradePackages({
        query: instancesData
          .map((instance) => `id:${instance.id}`)
          .join(" OR "),
        security_only: isSecurityOnly,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleApproveActivities = async () => {
    try {
      await approveActivities({
        query: "status:unapproved",
      });

      notify.success({
        message: "All activities have been approved successfully",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleApproveActivitiesDialog = () => {
    confirmModal({
      title: "Approve activities",
      body: "Are you sure you want to approve selected activities?",
      buttons: [
        <Button
          key="approve"
          appearance="positive"
          onClick={handleApproveActivities}
        >
          Approve
        </Button>,
      ],
    });
  };

  const handleConfirmUpgradesDialog = () => {
    const items = currentUpgradesTab === 2 ? "USNs" : "packages";
    confirmModal({
      title: `Upgrade ${items}`,
      body: `Are you sure you want to upgrade all ${items}?`,
      buttons: [
        <Button key="upgrade" appearance="positive" onClick={handleUpgradeAll}>
          Upgrade
        </Button>,
      ],
    });
  };

  return (
    <Row
      className={classNames("u-no-padding u-no-max-width", classes.container)}
    >
      <Col size={6} className={classes.tableContainer}>
        <div className={classes.tableHeader}>
          <p className="p-heading--5 u-no-margin--bottom">Upgrades available</p>
          <Button
            className="is-small u-no-margin--bottom"
            onClick={handleConfirmUpgradesDialog}
          >
            Upgrade all
          </Button>
        </div>
        <Tabs
          links={[
            {
              label: "Instances",
              role: "tab",
              active: 0 === currentUpgradesTab,
              onClick: () => {
                handleClickUpgradesTab(0);
              },
            },
            {
              label: "Packages",
              role: "tab",
              active: 1 === currentUpgradesTab,
              onClick: () => {
                handleClickUpgradesTab(1);
              },
            },
            {
              label: "USNs",
              role: "tab",
              active: 2 === currentUpgradesTab,
              onClick: () => {
                handleClickUpgradesTab(2);
              },
            },
          ]}
        />
        {getIsLoadingUpgrades() && <LoadingState />}
        {!getIsLoadingUpgrades() && upgradesTableData.length === 0 && (
          <EmptyState
            title="All instances are up to date"
            body="Your instances are up to date. Check back later for any new upgrades."
            cta={[
              <Button key="refresh" onClick={handleUpgradesRefresh}>
                Refresh
              </Button>,
            ]}
          />
        )}
        {!getIsLoadingUpgrades() && upgradesTableData.length > 0 && (
          <>
            <ModularTable
              data={upgradesTableData}
              columns={upgradesTableColumns}
              className="u-no-margin--bottom"
            />
            {getTotalTableItemsCount("upgrades") > 10 && (
              <ExpandableTableFooter
                viewAll
                itemNames={{
                  singular: getUpgradesTableFooterName(),
                  plural: `${getUpgradesTableFooterName()}s`,
                }}
                limit={10}
                onLimitChange={() => navigate(`${ROOT_PATH}instances`)}
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
          {currentActivitiesTab === 0 && (
            <Button
              className="is-small u-no-margin--bottom"
              onClick={handleApproveActivitiesDialog}
            >
              Approve all
            </Button>
          )}
        </div>
        <Tabs
          links={[
            {
              label: "Requires approval",
              role: "tab",
              ["data-testid"]: "activities-requires-approval-tab",
              active: 0 === currentActivitiesTab,
              onClick: () => {
                handleClickActivitiesTab(0);
              },
            },
            {
              label: "In progress",
              role: "tab",
              ["data-testid"]: "activities-in-progress-tab",
              active: 1 === currentActivitiesTab,
              onClick: () => {
                handleClickActivitiesTab(1);
              },
            },
          ]}
        />
        {getIsLoadingActivities() && <LoadingState />}
        {!getIsLoadingActivities() && activitiesTableData.length === 0 && (
          <EmptyState
            title={
              currentActivitiesTab === 0
                ? "All activities have been approved"
                : "There are no activities in progress"
            }
            body={
              currentActivitiesTab === 0
                ? "There are currently no pending approval requests. Check back later for any new approval activities"
                : "There are currently no activities in progress. Check back later."
            }
            cta={[
              <Button key="refresh" onClick={handleActivitiesRefresh}>
                Refresh
              </Button>,
            ]}
          />
        )}
        {!getIsLoadingActivities() && activitiesTableData.length > 0 && (
          <>
            <ModularTable
              data={activitiesTableData}
              columns={activitiesTableColumns}
              className="u-no-margin--bottom"
            />
            {getTotalTableItemsCount("activities") > 10 && (
              <ExpandableTableFooter
                viewAll
                itemNames={{
                  singular: "activity",
                  plural: "activities",
                }}
                limit={10}
                onLimitChange={() => navigate(`${ROOT_PATH}activities`)}
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
