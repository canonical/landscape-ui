import InfoItem from "@/components/layout/InfoItem";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import { boolToLabel } from "@/utils/output";
import type { MultiSelectItem } from "@canonical/react-components";
import {
  Col,
  Icon,
  ModularTable,
  Row,
  Switch,
  Tooltip,
} from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useAlerts } from "../../hooks";
import type { Alert } from "../../types";
import AlertTagsCell from "../AlertTagsCell";
import classes from "./AlertsTable.module.scss";
import { handleCellProps } from "./helpers";

interface AlertsTableProps {
  readonly alerts: Alert[];
  readonly availableTagOptions: MultiSelectItem[];
}

const AlertsTable: FC<AlertsTableProps> = ({ alerts, availableTagOptions }) => {
  const isLargerScreen = useMediaQuery("(min-width: 620px)");
  const debug = useDebug();
  const { unsubscribeQuery, subscribeQuery } = useAlerts();
  const { user } = useAuth();

  const { mutateAsync: subscribeMutation } = subscribeQuery;
  const { mutateAsync: unsubscribeMutation } = unsubscribeQuery;

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

  const columns = useMemo<Column<Alert>[]>(
    () => [
      {
        accessor: "label",
        className: classes.nameColumn,
        Header: "Name",
      },
      {
        Header: (
          <div className={classes.noWrap}>
            <span>Email </span>
            {user && (
              <Tooltip
                position="btm-left"
                message={`Enabling email notifications will send alerts to ${user.email}, associated with your account`}
              >
                <Icon name="help" />
              </Tooltip>
            )}
          </div>
        ),
        accessor: "subscribed",
        className: classes.emailColumn,
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
        accessor: "tags",
        Header: "Enabled for",
        className: classes.tags,
        Cell: ({ row: { original } }: CellProps<Alert>) => {
          return (
            <AlertTagsCell
              alert={original}
              availableTagOptions={availableTagOptions}
            />
          );
        },
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ row: { original } }: CellProps<Alert>) => (
          <>{original.description}</>
        ),
      },
    ],
    [alerts],
  );

  return isLargerScreen ? (
    <ModularTable
      columns={columns}
      data={alerts}
      getCellProps={handleCellProps}
      emptyMsg="No data available"
    />
  ) : (
    alerts.map((alert, index) => (
      <Row
        key={index}
        className={classNames(
          "u-no-padding--left u-no-padding--right",
          classes.alertsWrapper,
        )}
      >
        <Col size={2} small={2}>
          <InfoItem label="Name" value={alert.label} />
        </Col>
        <Col size={2} small={2}>
          <InfoItem
            label="Email"
            value={
              <div className={classes.switch}>
                <Switch
                  label={boolToLabel(alert.subscribed)}
                  defaultChecked={alert.subscribed}
                  onChange={() => handleSwitchChange(alert)}
                />
              </div>
            }
          />
        </Col>
        <Col size={2} small={2}>
          <InfoItem
            label="Enabled for"
            value={
              <AlertTagsCell
                alert={alert}
                availableTagOptions={availableTagOptions}
              />
            }
          />
        </Col>
        <Col size={2} small={2}>
          <InfoItem label="Description" value={alert.description} />
        </Col>
      </Row>
    ))
  );
};

export default AlertsTable;
