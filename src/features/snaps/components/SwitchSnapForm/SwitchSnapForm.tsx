import {
  DeliveryBlock,
  RandomizationBlock,
} from "@/components/form/DeliveryScheduling";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { pluralize } from "@/utils/_helpers";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useGetSnapInfo, useSnapAction } from "../../api";
import type { InstalledSnap } from "../../types";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import {
  getChannelName,
  getChannelOptions,
  getChannelRevision,
} from "./helpers";

interface SwitchSnapFormProps {
  readonly installedSnaps: InstalledSnap[];
}

const SwitchSnapForm: FC<SwitchSnapFormProps> = ({ installedSnaps }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction } = useSnapAction();

  const instanceId = Number(urlInstanceId);

  const { snapInfo, isSnapInfoLoading } = useGetSnapInfo({
    instance_id: instanceId,
    name: installedSnaps[0]?.snap.name ?? "",
  });

  const channelOptions = useMemo(
    () => getChannelOptions(snapInfo),
    [snapInfo],
  );

  const hasNoAvailableChannels =
    !!snapInfo && snapInfo["channel-map"].length === 0;

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        const deliverAfter =
          !values.deliver_immediately && values.deliver_after
            ? moment(values.deliver_after).format()
            : undefined;
        await snapAction({
          computer_ids: [instanceId],
          action: "refresh",
          snaps: installedSnaps.map((snap) => ({
            name: snap.snap.name,
            channel: getChannelName(snapInfo, values.release),
            revision: getChannelRevision(snapInfo, values.release),
          })),
          deliver_after: deliverAfter,
          deliver_after_window: !values.randomize_delivery
            ? undefined
            : values.deliver_delay_window,
        });
        closeSidePanel();
        notify.success({
          message: `You queued ${pluralize(installedSnaps.length, ["snap"], "exact")} to be switched.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    if (channelOptions[0] && !formik.values.release) {
      void formik.setFieldValue("release", channelOptions[0].value);
    }
    // formik reference is intentionally excluded — adding it causes infinite re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOptions]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="release"
        labelClassName="p-text--small p-text--small-caps"
        options={channelOptions}
        disabled={isSnapInfoLoading || channelOptions.length === 0}
        error={getFormikError(formik, "release")}
        help={
          hasNoAvailableChannels
            ? "No available channels to switch to."
            : undefined
        }
        {...formik.getFieldProps("release")}
      />
      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />
      <SidePanelFormButtons
        submitButtonText="Switch"
        submitButtonAppearance="positive"
        submitButtonDisabled={formik.isSubmitting}
      />
    </Form>
  );
};

export default SwitchSnapForm;
