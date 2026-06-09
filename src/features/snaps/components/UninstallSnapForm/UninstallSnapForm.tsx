import {
  DeliveryBlock,
  RandomizationBlock,
} from "@/components/form/DeliveryScheduling";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { getSelectionLabel, pluralize } from "@/utils/_helpers";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import type { FC } from "react";
import { useParams } from "react-router";
import { useSnapAction } from "../../api";
import type { InstalledSnap } from "../../types";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";

interface UninstallSnapFormProps {
  readonly installedSnaps: InstalledSnap[];
}

const UninstallSnapForm: FC<UninstallSnapFormProps> = ({ installedSnaps }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction } = useSnapAction();

  const instanceId = Number(urlInstanceId);

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
          action: "remove",
          snaps: installedSnaps.map((snap) => ({ name: snap.snap.name })),
          deliver_after: deliverAfter,
          deliver_after_window: !values.randomize_delivery
            ? undefined
            : values.deliver_delay_window,
        });
        closeSidePanel();
        notify.success({
          message: `You queued ${pluralize(installedSnaps.length, ["snap"], "exact")} to be uninstalled.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const snapLabel = getSelectionLabel(
    installedSnaps,
    (s) => s.snap.name,
    "snaps",
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <p>This will remove {snapLabel} from your system.</p>
      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />
      <SidePanelFormButtons
        submitButtonText="Uninstall"
        submitButtonAppearance="negative"
        submitButtonDisabled={formik.isSubmitting}
      />
    </Form>
  );
};

export default UninstallSnapForm;
