import { Form, Input, Select } from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import { ChangeEvent, FC, useEffect, useMemo } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "./EditSnap.module.scss";
import {
  getEditSnapValidationSchema,
  getSnapMessage,
  SnapFormProps,
} from "./helpers";
import { useSnaps } from "@/hooks/useSnaps";
import { InstalledSnap } from "@/types/Snap";
import { EditSnapType } from "../helpers";
import useSidePanel from "@/hooks/useSidePanel";
import { useParams } from "react-router-dom";

interface EditSnapProps {
  type: EditSnapType;
  installedSnaps: InstalledSnap[];
}

const EditSnap: FC<EditSnapProps> = ({ installedSnaps, type }) => {
  const { instanceId: urlInstanceId } = useParams();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapsActionQuery, getAvailableSnapInfo } = useSnaps();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: snapsActionMutation, isLoading } = snapsActionQuery;
  const { data: snapInfoData } = getAvailableSnapInfo(
    {
      instance_id: instanceId,
      name: installedSnaps[0].snap.name,
    },
    {
      enabled: type === EditSnapType.Switch,
    },
  );

  const SNAP_CHANNEL_OPTIONS = useMemo(() => {
    return (
      snapInfoData?.data["channel-map"]
        .sort((a, b) =>
          a.channel.architecture.localeCompare(b.channel.architecture),
        )
        .map((channel) => ({
          label: `${channel.channel.name} - ${channel.channel.architecture}`,
          value: `${channel.channel.name} - ${channel.channel.architecture}`,
        })) ?? []
    );
  }, [snapInfoData?.data]);

  const validationSchema = getEditSnapValidationSchema(type);
  const installedSnap = installedSnaps.length === 1 ? installedSnaps[0] : null;
  const initialSnap = installedSnap
    ? snapInfoData?.data["channel-map"][0]
    : null;

  const formik = useFormik<SnapFormProps>({
    initialValues: {
      release: undefined,
      hold: type === EditSnapType.Hold ? "forever" : undefined,
      hold_until: type === EditSnapType.Hold ? "" : undefined,
      deliver_immediately: true,
      randomize_delivery: false,
      deliver_delay_window: 0,
      deliver_after: "",
    },
    validationSchema: Yup.object().shape(validationSchema),
    onSubmit: async (values) => {
      try {
        snapsActionMutation({
          computer_ids: [instanceId],
          action:
            type === EditSnapType.Uninstall
              ? "remove"
              : type === EditSnapType.Switch
                ? "refresh"
                : type.toLowerCase(),
          snaps: installedSnaps.map((installedSnap) => ({
            name: installedSnap.snap.name,
            channel: values.release
              ? snapInfoData?.data["channel-map"].find(
                  (channel) =>
                    `${channel.channel.name} - ${channel.channel.architecture}` ===
                    values.release,
                )?.channel.name
              : undefined,
            revision: snapInfoData?.data["channel-map"]
              .find(
                (channel) =>
                  `${channel.channel.name} - ${channel.channel.architecture}` ===
                  values.release,
              )
              ?.revision.toString(),
            time:
              values.hold === "forever"
                ? "forever"
                : values.hold_until
                  ? moment(values.hold_until).format()
                  : undefined,
          })),
          deliver_after: values.deliver_immediately
            ? undefined
            : values.deliver_after
              ? moment(values.deliver_after).format()
              : undefined,
          deliver_after_window: !values.randomize_delivery
            ? undefined
            : values.deliver_delay_window,
        });

        closeSidePanel();

        const actionVerb =
          type === EditSnapType.Hold
            ? "held"
            : type === EditSnapType.Unhold
              ? "unheld"
              : `${type.toLowerCase()}ed`;

        notify.success({
          message: `You queued ${installedSnap ? installedSnap.snap.name : `${installedSnaps.length} snaps`} to be ${actionVerb}.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    if (initialSnap && type === EditSnapType.Switch && !formik.values.release) {
      formik.setFieldValue(
        "release",
        `${initialSnap.channel.name} - ${initialSnap.channel.architecture}`,
      );
    }
  }, [initialSnap]);

  const handleHoldSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("hold", event.currentTarget.value);
    if (event.currentTarget.value === "date") {
      formik.setFieldValue("hold_until", moment().toISOString().slice(0, 16));
    }
  };

  const handleDeliveryTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const deliverImmediately = event.currentTarget.value === "true";
    formik.setFieldValue("deliver_immediately", deliverImmediately);
    if (!deliverImmediately) {
      formik.setFieldValue(
        "deliver_after",
        moment().toISOString().slice(0, 16),
      );
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {getSnapMessage(type, installedSnaps)}
      {type === EditSnapType.Switch && (
        <Select
          label="release"
          labelClassName="p-text--small p-text--small-caps"
          options={SNAP_CHANNEL_OPTIONS}
          disabled={SNAP_CHANNEL_OPTIONS.length === 0}
          {...formik.getFieldProps("release")}
        />
      )}
      {type === EditSnapType.Hold && (
        <>
          <span className={classes.bold}>Hold</span>
          <div className={classes.radioGroup}>
            <Input
              type="radio"
              label="Indefinitely"
              {...formik.getFieldProps("hold")}
              onChange={handleHoldSelectionChange}
              checked={formik.values.hold === "forever"}
              value="forever"
            />
            <Input
              type="radio"
              label="Select date"
              {...formik.getFieldProps("hold")}
              onChange={handleHoldSelectionChange}
              checked={formik.values.hold === "date"}
              value="date"
            />
          </div>
          {formik.values.hold === "date" && (
            <Input
              type="datetime-local"
              error={
                formik.touched.hold_until && formik.errors.hold_until
                  ? formik.errors.hold_until
                  : undefined
              }
              {...formik.getFieldProps("hold_until")}
            />
          )}
        </>
      )}
      <span className={classNames(classes.bold, classes.marginTop)}>
        Delivery time
      </span>
      <div className={classes.radioGroup}>
        <Input
          type="radio"
          label="As soon as possible"
          name="deliver_immediately"
          value="true"
          onChange={handleDeliveryTimeChange}
          checked={formik.values.deliver_immediately}
        />
        <Input
          type="radio"
          label="Scheduled"
          name="deliver_immediately"
          value="false"
          onChange={handleDeliveryTimeChange}
          checked={!formik.values.deliver_immediately}
        />
      </div>
      {!formik.values.deliver_immediately && (
        <Input
          type="datetime-local"
          label="Deliver after"
          labelClassName="u-off-screen"
          {...formik.getFieldProps("deliver_after")}
          error={formik.touched.deliver_after && formik.errors.deliver_after}
        />
      )}
      <span className={classNames(classes.bold, classes.marginTop)}>
        Randomise delivery over a time window
      </span>
      <div className={classes.radioGroup}>
        <Input
          type="radio"
          label="No"
          {...formik.getFieldProps("randomize_delivery")}
          onChange={async () => {
            await formik.setFieldValue("randomize_delivery", false);
            await formik.setFieldValue("deliver_delay_window", 0);
          }}
          checked={!formik.values.randomize_delivery}
        />
        <Input
          type="radio"
          label="Yes"
          {...formik.getFieldProps("randomize_delivery")}
          onChange={() => formik.setFieldValue("randomize_delivery", true)}
          checked={formik.values.randomize_delivery}
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
      <SidePanelFormButtons
        submitButtonText={type}
        submitButtonAppearance={
          type === EditSnapType.Uninstall ? "negative" : "positive"
        }
        submitButtonDisabled={isLoading}
      />
    </Form>
  );
};

export default EditSnap;
