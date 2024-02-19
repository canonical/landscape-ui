import { FC, lazy, Suspense, useMemo } from "react";
import { CellProps, Column, Row } from "react-table";
import {
  Button,
  CheckboxInput,
  ModularTable,
  Switch,
} from "@canonical/react-components";
import LoadingState from "../../../../components/layout/LoadingState";
import useAlerts from "../../../../hooks/useAlerts";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Alert } from "../../../../types/Alert";
import classes from "./AlertList.module.scss";
import { boolToLabel } from "../../../../utils/output";

const EditAlertForm = lazy(() => import("./EditAlertForm"));
const ShowSubscribersPanel = lazy(() => import("./ShowSubscribersPanel"));

interface AlertListProps {
  alerts: Alert[];
  selectedAlerts: string[];
  setSelectedAlerts: (alerts: string[]) => void;
}

const AlertList: FC<AlertListProps> = ({
  alerts,
  selectedAlerts,
  setSelectedAlerts,
}) => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { unsubscribeQuery, subscribeQuery } = useAlerts();
  const { mutateAsync: subscribeMutation } = subscribeQuery;
  const { mutateAsync: unsubscribeMutation } = unsubscribeQuery;

  const handleEditAlert = (alert: Alert) => {
    setSidePanelContent(
      `Edit ${alert.label}`,
      <Suspense fallback={<LoadingState />}>
        <EditAlertForm alert={alert} />
      </Suspense>,
    );
  };

  const handleShowSubscribers = (alert: Alert) => {
    setSidePanelContent(
      alert.label,
      <Suspense fallback={<LoadingState />}>
        <ShowSubscribersPanel alert={alert} />
      </Suspense>,
    );
  };

  const handleSwitchChange = async (alert: Alert) => {
    const subscriptionMutation = alert.subscribed
      ? unsubscribeMutation
      : subscribeMutation;
    try {
      await subscriptionMutation({
        alert_type: alert.alert_type,
      });
    } catch (error) {
      debug(error);
    }
  };

  const toggleAll = () => {
    setSelectedAlerts(
      selectedAlerts.length !== 0
        ? []
        : alerts.map(({ alert_type }) => alert_type),
    );
  };

  const handleSelectionChange = (row: Row<Alert>) => {
    selectedAlerts.includes(row.original.alert_type)
      ? setSelectedAlerts(
          selectedAlerts.filter(
            (alertType) => alertType !== row.original.alert_type,
          ),
        )
      : setSelectedAlerts([...selectedAlerts, row.original.alert_type]);
  };

  const alertsData = useMemo(() => alerts, [alerts]);

  const columns = useMemo<Column<Alert>[]>(
    () => [
      {
        Header: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all</span>}
              inline
              onChange={toggleAll}
              checked={
                selectedAlerts.length === alerts.length && alerts.length !== 0
              }
              indeterminate={
                selectedAlerts.length !== 0 &&
                selectedAlerts.length < alerts.length
              }
            />
            <span>Name</span>
          </>
        ),
        accessor: "label",
        className: classes.name,
        Cell: ({ row }: CellProps<Alert>) => (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">{row.original.label}</span>}
              inline
              checked={selectedAlerts.includes(row.original.alert_type)}
              onChange={() => handleSelectionChange(row)}
            />
            <Button
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => handleShowSubscribers(row.original)}
              aria-label={`List subscribers of alert ${row.original.label}`}
            >
              {row.original.label}
            </Button>
          </>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: CellProps<Alert>) => <>{row.original.status}</>,
      },
      {
        Header: "Enabled for",
        accessor: "all_computers",
        Cell: ({ row }: CellProps<Alert>) => {
          const containingTags =
            row.original.tags.length > 0 ? row.original.tags.join(", ") : "";
          return row.original.all_computers ? (
            <>All instances</>
          ) : row.original.tags.length > 0 ? (
            <>Instances tagged with {containingTags}</>
          ) : (
            <>Account</>
          );
        },
      },
      {
        Header: "Subscribed",
        accessor: "subscribed",
        Cell: ({ row }: CellProps<Alert>) => (
          <div className={classes.switch}>
            <Switch
              label={boolToLabel(row.original.subscribed)}
              defaultChecked={row.original.subscribed}
              onChange={() => handleSwitchChange(row.original)}
            />
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        className: classes.description,
        Cell: ({ row }: CellProps<Alert>) => <>{row.original.description}</>,
      },
      {
        accessor: "alert_type",
        className: classes.actions,
        Cell: ({ row }: CellProps<Alert>) => (
          <Button
            small
            hasIcon
            appearance="base"
            className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-center"
            aria-label={`Edit ${row.original.label}`}
            onClick={() => handleEditAlert(row.original)}
          >
            <span className="p-tooltip__message">Edit</span>
            <i className="p-icon--edit u-no-margin--left" />
          </Button>
        ),
      },
    ],
    [selectedAlerts, alerts],
  );

  return (
    <ModularTable
      emptyMsg="No alerts found"
      columns={columns}
      data={alertsData}
    />
  );
};

export default AlertList;
