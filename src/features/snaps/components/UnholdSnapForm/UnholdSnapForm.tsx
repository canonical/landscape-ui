import PluralizeWithBoldCount from "@/components/ui/PluralizeWithBoldCount/PluralizeWithBoldCount";
import {
  DeliveryBlock,
  RandomizationBlock,
} from "@/components/form/DeliveryScheduling";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { hasOneItem, pluralize } from "@/utils/_helpers";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import type { FC } from "react";
import { useParams } from "react-router";
import { useSnapAction } from "../../api";
import type { InstalledSnap } from "../../types";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { SnapFormValues } from "./types";

interface UnholdSnapFormProps {
  readonly installedSnaps: InstalledSnap[];
}

const UnholdSnapForm: FC<UnholdSnapFormProps> = ({ installedSnaps }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction } = useSnapAction();

  const instanceId = Number(urlInstanceId);

  const heldSnaps = installedSnaps.filter((s) => s.held_until !== null);
  const unheldSnaps = installedSnaps.filter((s) => s.held_until === null);

  const formik = useFormik<SnapFormValues>({
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
          action: "unhold",
          snaps: installedSnaps.map((snap) => ({ name: snap.snap.name })),
          deliver_after: deliverAfter,
          deliver_after_window: !values.randomize_delivery
            ? undefined
            : values.deliver_delay_window,
        });
        closeSidePanel();
        notify.success({
          message: `You queued ${pluralize(installedSnaps.length, ["snap"], "exact")} to be unheld.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {hasOneItem(installedSnaps) ? (
        <p>
          This will resume automatic updates for {installedSnaps[0].snap.name},
          and it will be eligible for the latest version upgrades based on the
          regular refresh schedule.
        </p>
      ) : (
        <>
          <p>
            Unholding a snap will resume automatic updates for that particular
            snap.
          </p>
          {heldSnaps.length > 0 && unheldSnaps.length > 0 && (
            <>
              <span>
                You selected {installedSnaps.length} snaps. This will:
              </span>
              <ul>
                <li>
                  unhold{" "}
                  <PluralizeWithBoldCount
                    count={heldSnaps.length}
                    singular="snap"
                  />
                </li>
                <li>
                  leave{" "}
                  <PluralizeWithBoldCount
                    count={unheldSnaps.length}
                    singular="snap"
                  />{" "}
                  unheld
                </li>
              </ul>
            </>
          )}
        </>
      )}
      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />
      <SidePanelFormButtons
        submitButtonText="Unhold"
        submitButtonAppearance="positive"
        submitButtonDisabled={formik.isSubmitting}
      />
    </Form>
  );
};

export default UnholdSnapForm;
