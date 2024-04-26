import { FC } from "react";
import { Col, Form, Input, Row, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { CommonPackagesActionParams, usePackages } from "@/hooks/usePackages";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import moment from "moment";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import classes from "./InstalledPackagesActionForm.module.scss";
import classNames from "classnames";
import { Package } from "@/types/Package";
import InfoItem from "@/components/layout/InfoItem";
import { CTA_LABELS, INITIAL_VALUES } from "./constants";
import { FormProps } from "./types";
import PackagesUpgradeInfo from "@/pages/dashboard/instances/[single]/tabs/packages/PackagesUpgradeInfo";
import * as Yup from "yup";

interface InstalledPackagesActionFormProps {
  action: "remove" | "upgrade" | "downgrade";
  instanceId: number;
  packages: Package[];
}

const InstalledPackagesActionForm: FC<InstalledPackagesActionFormProps> = ({
  action,
  instanceId,
  packages,
}) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    downgradePackageVersionQuery,
    getDowngradePackageVersionsQuery,
    removePackagesQuery,
    upgradePackagesQuery,
  } = usePackages();

  const {
    data: getDowngradePackageVersionsQueryResult,
    error: getDowngradePackageVersionsQueryError,
  } = getDowngradePackageVersionsQuery(
    {
      instanceId,
      packageName: packages[0].name,
    },
    {
      enabled: action === "downgrade",
    },
  );

  if (getDowngradePackageVersionsQueryError) {
    debug(getDowngradePackageVersionsQueryError);
  }

  const downgradeOptions =
    getDowngradePackageVersionsQueryResult &&
    getDowngradePackageVersionsQueryResult.data.results.length > 0
      ? getDowngradePackageVersionsQueryResult.data.results.map(
          ({ version }) => ({ label: version, value: version }),
        )
      : [];

  downgradeOptions.unshift({ label: "Select version", value: "" });

  const packagesToUpgrade = packages
    .filter(({ status }) => ["upgrade", "security"].includes(status))
    .map(({ name }) => name);

  const securityUpgradeCount = packages.filter(
    ({ status }) => status === "security",
  ).length;

  const { mutateAsync: downgradePackageVersion } = downgradePackageVersionQuery;
  const { mutateAsync: removePackages } = removePackagesQuery;
  const { mutateAsync: upgradePackages } = upgradePackagesQuery;

  const VALIDATION_SCHEMA = Yup.object({
    deliver_after: Yup.string().test({
      test: (value) => {
        if (!value) {
          return true;
        }

        return moment(value).isValid();
      },
      message: "You have to enter a valid date and time",
    }),
    deliver_delay_window: Yup.number().min(
      0,
      "Delivery delay must be greater than or equal to 0",
    ),
    deliver_immediately: Yup.boolean(),
    randomize_delivery: Yup.boolean(),
    version: Yup.string().test({
      name: "required",
      message: "This field is required",
      params: { action },
      test: (value) => action !== "downgrade" || !!value,
    }),
  });

  const handleSubmit = async (values: FormProps) => {
    const commonPackagesParams: Omit<CommonPackagesActionParams, "packages"> = {
      query: `id:${instanceId}`,
      deliver_after: values.deliver_immediately
        ? undefined
        : `${values.deliver_after}:00Z`,
      deliver_delay_window: values.randomize_delivery
        ? undefined
        : values.deliver_delay_window,
    };

    try {
      if (action === "remove") {
        await removePackages({
          ...commonPackagesParams,
          packages: packages
            .filter((pkg) => pkg.current_version)
            .map(({ name }) => name),
        });
      } else if (action === "upgrade") {
        await upgradePackages({
          ...commonPackagesParams,
          packages: packagesToUpgrade,
        });
      } else if (action === "downgrade") {
        await downgradePackageVersion({
          instanceId,
          package_name: packages[0].name,
          package_version: values.version,
        });
      }

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
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
      {["remove", "upgrade"].includes(action) && (
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
                  moment().toISOString().slice(0, 16),
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
            Randomize delivery
          </span>
          <div className={classes.radioGroup}>
            <Input
              type="radio"
              label="Yes"
              name="randomize_delivery"
              checked={formik.values.randomize_delivery}
              onChange={() => {
                formik.setFieldValue("randomize_delivery", true);
              }}
            />
            <Input
              type="radio"
              label="No"
              name="randomize_delivery"
              checked={!formik.values.randomize_delivery}
              onChange={() => {
                formik.setFieldValue("randomize_delivery", false);
                formik.setFieldValue("deliver_delay_window", 0);
              }}
            />
          </div>
          {!formik.values.randomize_delivery && (
            <Input
              type="number"
              min={0}
              label="Delivery delay window"
              labelClassName="u-off-screen"
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

      {(["remove", "upgrade"].includes(action) ||
        downgradeOptions.length > 1) && (
        <SidePanelFormButtons
          submitButtonDisabled={formik.isSubmitting}
          submitButtonText={CTA_LABELS[action]}
          submitButtonAppearance={action === "remove" ? "negative" : "positive"}
        />
      )}
    </Form>
  );
};

export default InstalledPackagesActionForm;
