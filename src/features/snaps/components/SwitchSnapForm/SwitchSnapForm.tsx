import {
  DeliveryBlock,
  RandomizationBlock,
} from "@/components/form/DeliveryScheduling";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { Form } from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import date from "@/libs/date";
import { type FC, useState } from "react";
import { useParams } from "react-router";
import { useSnapAction } from "../../api";
import { getSnapActionArgs } from "../../helpers";
import type { AvailableSnapInfo, InstalledSnap, SnapMode } from "../../types";
import SnapChannelRevisionFields from "../SnapChannelRevisionFields";
import { VALIDATION_SCHEMA } from "./constants";
import type { SwitchFormValues } from "./types";
import { getInitialValues } from "./helpers";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import classes from "./SwitchSnapForm.module.scss";

interface SwitchSnapFormProps {
  readonly snap: InstalledSnap;
  readonly snapInfo: AvailableSnapInfo | null;
}

const SwitchSnapForm: FC<SwitchSnapFormProps> = ({ snap, snapInfo }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { closeSidePanel } = useSidePanel();
  const { snapAction } = useSnapAction();
  const [isChannelInfoLoading, setIsChannelInfoLoading] = useState(false);
  const [isChannelInfoError, setIsChannelInfoError] = useState(false);

  const instanceId = Number(urlInstanceId);

  const formik = useFormik<SwitchFormValues>({
    initialValues: getInitialValues(snapInfo?.["channel-map"]),
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      // The fields show the loading or error state, so only block submission.
      if (
        values.mode === "channel" &&
        (isChannelInfoLoading || isChannelInfoError)
      ) {
        return;
      }

      try {
        const deliverAfter =
          !values.deliver_immediately && values.deliver_after
            ? date(values.deliver_after).format()
            : undefined;
        const { data: activity } = await snapAction({
          computer_ids: [instanceId],
          action: "refresh",
          snaps: [{ name: snap.snap.name, args: getSnapActionArgs(values) }],
          deliver_after: deliverAfter,
          deliver_after_window: !values.randomize_delivery
            ? undefined
            : values.deliver_delay_window,
        });
        closeSidePanel();
        notify.success({
          message: `You queued ${snap.snap.name} to be switched.`,
          actions: [
            {
              label: "View details",
              onClick: () => {
                openActivityDetails(activity);
              },
            },
          ],
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleValueChange = (
    value: string,
    channel?: string,
    confinement?: string,
  ) => {
    formik.setValues((prev) => ({ ...prev, value, channel, confinement }));
  };

  const handleModeChange = (mode: SnapMode) => {
    formik.setValues((prev) => ({
      ...prev,
      mode,
      value: "",
      channel: undefined,
      confinement: mode === "revision" ? undefined : prev.confinement,
    }));
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <div className={classes.fields}>
        <div
          className={classNames(
            "p-text--small p-text--small-caps",
            classes.label,
          )}
        >
          Switch to
        </div>
        <SnapChannelRevisionFields
          instanceIds={[instanceId]}
          snapName={snap.snap.name}
          snapModeConfig={formik.values}
          hasAttemptedSubmit={formik.submitCount > 0}
          onLoadingChange={setIsChannelInfoLoading}
          onErrorChange={setIsChannelInfoError}
          onChange={handleValueChange}
          onModeChange={handleModeChange}
        />
      </div>
      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />
      <SidePanelFormButtons
        submitButtonText="Switch"
        submitButtonAppearance="positive"
        submitButtonLoading={formik.isSubmitting}
        formError={
          formik.values.mode === "channel" ? formik.errors.value : undefined
        }
      />
    </Form>
  );
};

export default SwitchSnapForm;
