import { AxiosResponse } from "axios";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { Col, Form, Input, Row, Select } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import { Activity, useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { INSTALLED_PACKAGE_ACTIONS } from "../../constants";
import { usePackages } from "../../hooks";
import { InstalledPackageAction, Package } from "../../types";
import PackagesUpgradeInfo from "../PackagesUpgradeInfo";
import { INITIAL_VALUES } from "./constants";
import {
  getActionInfo,
  getActionSuccessNotificationProps,
  getValidationSchema,
} from "./helpers";
import { FormProps } from "./types";
import classes from "./InstalledPackagesActionForm.module.scss";

interface InstalledPackagesActionFormProps {
  action: InstalledPackageAction;
  packages: Package[];
}

const InstalledPackagesActionForm: FC<InstalledPackagesActionFormProps> = ({
  action,
  packages,
}) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams();
  const debug = useDebug();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();
  const { closeSidePanel } = useSidePanel();
  const {
    downgradePackageVersionQuery,
    getDowngradePackageVersionsQuery,
    upgradePackagesQuery,
    packagesActionQuery,
  } = usePackages();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { data: getDowngradePackageVersionsQueryResult } =
    getDowngradePackageVersionsQuery(
      {
        instanceId,
        packageName: packages[0].name,
      },
      {
        enabled: action === "downgrade",
      },
    );

  const downgradeOptions =
    getDowngradePackageVersionsQueryResult?.data.results.map(({ version }) => ({
      label: version,
      value: version,
    })) ?? [];

  downgradeOptions.unshift({ label: "Select version", value: "" });

  const packagesToUpgrade = packages
    .filter(
      ({ status, available_version }) =>
        status === "security" || (status === "installed" && available_version),
    )
    .map(({ name }) => name);

  const securityUpgradeCount = packages.filter(
    ({ status }) => status === "security",
  ).length;

  const { mutateAsync: downgradePackageVersion } = downgradePackageVersionQuery;
  const { mutateAsync: upgradePackages } = upgradePackagesQuery;
  const { mutateAsync: packagesAction } = packagesActionQuery;

  const handleSubmit = async (values: FormProps) => {
    const packagesDeliveryParams = {
      deliver_after: values.deliver_immediately
        ? undefined
        : `${values.deliver_after}:00Z`,
      deliver_delay_window: !values.randomize_delivery
        ? undefined
        : values.deliver_delay_window,
    };

    let promise: Promise<AxiosResponse<Activity>>;

    if (action === "upgrade") {
      promise = upgradePackages({
        ...packagesDeliveryParams,
        packages: packagesToUpgrade,
        query: `id:${instanceId}`,
      });
    } else if (action === "downgrade") {
      promise = downgradePackageVersion({
        instanceId,
        package_name: packages[0].name,
        package_version: values.version,
      });
    } else {
      promise = packagesAction({
        ...packagesDeliveryParams,
        action,
        computer_ids: [instanceId],
        package_ids: packages.map(({ id }) => id),
      });
    }

    try {
      const { data: activity } = await promise;

      closeSidePanel();

      notify.success({
        ...getActionSuccessNotificationProps(action, packages, values.version),
        actions: [
          { label: "Details", onClick: () => openActivityDetails(activity) },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: getValidationSchema(action),
    onSubmit: handleSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {action === "downgrade" && (
        <Row className="u-no-padding--left u-no-padding--right">
          <Col size={6}>
            <InfoItem
              label="Current version"
              value={packages[0].current_version}
            />
          </Col>
          <Col size={6}>
            {downgradeOptions.length > 1 ? (
              <Select
                label="New version"
                className=""
                labelClassName="p-text--small u-text--muted u-no-margin--bottom p-text--small-caps"
                {...formik.getFieldProps("version")}
                options={downgradeOptions}
              />
            ) : (
              <p>No downgrade versions</p>
            )}
          </Col>
        </Row>
      )}
      {action === "upgrade" &&
        (packages.length !== packagesToUpgrade.length ||
          securityUpgradeCount > 0) && (
          <PackagesUpgradeInfo
            packageCount={packages.length}
            securityUpgradePackageCount={securityUpgradeCount}
            totalUpgradePackageCount={packagesToUpgrade.length}
          />
        )}
      {(action === "hold" || action === "unhold") && (
        <p>{getActionInfo(packages, action)}</p>
      )}
      {["remove", "upgrade", "hold", "unhold"].includes(action) && (
        <>
          <span className={classes.bold}>Delivery time</span>
          <div className={classes.radioGroup}>
            <Input
              type="radio"
              label="As soon as possible"
              name="deliver_immediately"
              checked={formik.values.deliver_immediately}
              onChange={() => {
                formik.setFieldValue("deliver_immediately", true);
              }}
            />
            <Input
              type="radio"
              label="Scheduled"
              name="deliver_immediately"
              checked={!formik.values.deliver_immediately}
              onChange={() => {
                formik.setFieldValue("deliver_immediately", false);
                formik.setFieldValue(
                  "deliver_after",
                  moment()
                    .utc(true)
                    .add(1, "minute")
                    .toISOString()
                    .slice(0, 16),
                );
              }}
            />
          </div>
          {!formik.values.deliver_immediately && (
            <Input
              type="datetime-local"
              label="Deliver after"
              labelClassName="u-off-screen"
              {...formik.getFieldProps("deliver_after")}
              error={
                formik.touched.deliver_after && formik.errors.deliver_after
                  ? formik.errors.deliver_after
                  : undefined
              }
            />
          )}
          <span className={classNames(classes.bold, classes.marginTop)}>
            Randomise delivery over a time window
          </span>
          <div className={classes.radioGroup}>
            <Input
              type="radio"
              label="No"
              name="randomize_delivery"
              checked={!formik.values.randomize_delivery}
              onChange={async () => {
                await formik.setFieldValue("randomize_delivery", false);
                await formik.setFieldValue("deliver_delay_window", 0);
              }}
            />
            <Input
              type="radio"
              label="Yes"
              name="randomize_delivery"
              checked={formik.values.randomize_delivery}
              onChange={() => formik.setFieldValue("randomize_delivery", true)}
            />
          </div>
          {formik.values.randomize_delivery && (
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              label="Delivery delay window"
              labelClassName="u-off-screen"
              help="Time in minutes"
              {...formik.getFieldProps("deliver_delay_window")}
              error={
                formik.touched.deliver_delay_window &&
                formik.errors.deliver_delay_window
                  ? formik.errors.deliver_delay_window
                  : undefined
              }
            />
          )}
        </>
      )}

      {(action !== "downgrade" || downgradeOptions.length > 1) && (
        <SidePanelFormButtons
          submitButtonDisabled={formik.isSubmitting}
          submitButtonText={INSTALLED_PACKAGE_ACTIONS[action].label}
          submitButtonAppearance={INSTALLED_PACKAGE_ACTIONS[action].appearance}
        />
      )}
    </Form>
  );
};

export default InstalledPackagesActionForm;
