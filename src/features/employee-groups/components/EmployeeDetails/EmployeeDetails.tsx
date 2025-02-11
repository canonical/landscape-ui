/* eslint-disable @typescript-eslint/no-unused-vars */
import InfoItem from "@/components/layout/InfoItem";
import { ROOT_PATH } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  CheckboxInput,
  Col,
  ConfirmationButton,
  Form,
  Icon,
  Input,
  ModularTable,
  Row,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import {
  REMOVE_FROM_LANDSCAPE_TOOLTIP_MESSAGE,
  SANITIZATION_TOOLTIP_MESSAGE,
} from "../../constants";
import type { Employee } from "../../types";
import useInstances from "@/hooks/useInstances";
import type { Instance } from "@/types/Instance";
import classNames from "classnames";
import EmployeeDetailsContextualMenu from "../EmployeeDetailsContextualMenu/EmployeeDetailsContextualMenu";
import classes from "./EmployeeDetails.module.scss";

interface EmployeeDetailsProps {
  readonly employee: Employee;
}

const EmployeeDetails: FC<EmployeeDetailsProps> = ({ employee }) => {
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getEmployeeInstancesQuery } = useInstances();

  const { data: employeeInstancesQueryResult, isLoading } =
    getEmployeeInstancesQuery({
      employeeId: employee.id,
      with_provisioning_info: true,
    });

  const employeeInstances = employeeInstancesQueryResult?.data || [];

  const formik = useFormik({
    initialValues: {
      confirmationText: "",
      sanitizeInstances: false,
      removeFromLandscape: false,
    },
    enableReinitialize: true,
    onSubmit: () => {
      formik.resetForm();
      closeSidePanel();
      notify.success({
        title: `You have successfully deactivated ${employee.name}`,
        message:
          "This employee won’t be able to log in to Landscape or register new instances with their account.",
      });
    },
  });

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row }: CellProps<Instance>) => (
          <Link
            className={classes.link}
            to={
              row.original.parent
                ? `${ROOT_PATH}instances/${row.original.parent.id}/${row.original.id}`
                : `${ROOT_PATH}instances/${row.original.id}`
            }
          >
            {row.original.title}
          </Link>
        ),
      },

      {
        accessor: "status",
        Header: "status",
        Cell: ({
          row: {
            original: { status },
          },
        }: CellProps<Instance>) => (status ? "Enabled" : "Disabled"), //TODO change
        getCellIcon: ({
          row: {
            original: { status },
          },
        }: CellProps<Instance>) =>
          status ? "status-succeeded-small" : "status-queued-small", //TODO change
      },
      {
        accessor: "recovery_key",
        Header: "recovery key",
        Cell: () => "****************",
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "actions",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <EmployeeDetailsContextualMenu instance={original} />
        ),
      },
    ],
    [employee],
  );

  return (
    <>
      <div>
        <ConfirmationButton
          className="p-segmented-control__button has-icon"
          confirmationModalProps={{
            title: `Deactivate ${employee.name}`,
            children: (
              <>
                <Form noValidate>
                  <p>
                    This will prevent {employee.name} from logging in to
                    Landscape and from registering any new instances with their
                    account.
                  </p>
                  <p>
                    Type <b>deactivate {employee.name}</b> to confirm
                  </p>
                  <Input
                    type="text"
                    {...formik.getFieldProps("confirmationText")}
                  />
                  <b>Additional actions</b>
                  <div>
                    <CheckboxInput
                      label={
                        <span>
                          <span className={classes.title}>
                            Sanitize associated instances
                          </span>
                          <Tooltip
                            position="top-center"
                            message={SANITIZATION_TOOLTIP_MESSAGE}
                            positionElementClassName={
                              classes.tooltipPositionElement
                            }
                          >
                            <Icon name="help" aria-hidden />
                            <span className="u-off-screen">Help</span>
                          </Tooltip>
                        </span>
                      }
                      {...formik.getFieldProps("sanitizeInstances")}
                    />
                    <CheckboxInput
                      label={
                        <span>
                          <span className={classes.title}>
                            Remove associated instances from Landscape
                          </span>
                          <Tooltip
                            position="top-center"
                            message={REMOVE_FROM_LANDSCAPE_TOOLTIP_MESSAGE}
                            positionElementClassName={
                              classes.tooltipPositionElement
                            }
                          >
                            <Icon name="help" aria-hidden />
                            <span className="u-off-screen">Help</span>
                          </Tooltip>
                        </span>
                      }
                      {...formik.getFieldProps("removeFromLandscape")}
                    />
                  </div>
                </Form>
              </>
            ),
            confirmButtonLabel: "Deactivate",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled:
              formik.values.confirmationText !== `deactivate ${employee.name}`,
            onConfirm: () => formik.handleSubmit(),
          }}
        >
          <Icon name="pause" />
          <span>Deactivate</span>
        </ConfirmationButton>
      </div>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="name" value={employee.name} />
        </Col>
        <Col size={6}>
          <InfoItem label="email" value={employee.email} />
        </Col>
      </Row>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem
            label="employee groups"
            value={"TEMP EMPLOYEE GROUPS TO CHANGE"}
            type="truncated"
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="status"
            value={employee.is_active ? "active" : "inactive"}
          />
        </Col>
      </Row>
      <InfoItem
        label="autoinstall file"
        value={"TEMP AUTOINSTALL FILE TO CHANGE"}
      />

      <h4 className={classNames(classes.tableSection, "p-heading--5")}>
        Instances associated
      </h4>
      <ModularTable data={employeeInstances} columns={columns} />
    </>
  );
};

export default EmployeeDetails;
