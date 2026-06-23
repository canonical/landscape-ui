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
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import date from "@/libs/date";
import type { ChangeEvent, FC } from "react";
import { useParams } from "react-router";
import { useSnapAction } from "../../api";
import type { InstalledSnap } from "../../types";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { HoldFormValues } from "./types";
import classes from "./HoldSnapForm.module.scss";

interface HoldSnapFormProps {
  readonly installedSnaps: InstalledSnap[];
}

const HoldSnapForm: FC<HoldSnapFormProps> = ({ installedSnaps }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { snapAction } = useSnapAction();

  const instanceId = Number(urlInstanceId);

  const heldSnaps = installedSnaps.filter((s) => s.held_until !== null);
  const unheldSnaps = installedSnaps.filter((s) => s.held_until === null);

  const formik = useFormik<HoldFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        let holdTime: string | undefined;
        if (values.hold === "forever") {
          holdTime = "forever";
        } else if (values.hold_until) {
          holdTime = date(values.hold_until).format();
        }

        const deliverAfter =
          !values.deliver_immediately && values.deliver_after
            ? date(values.deliver_after).format()
            : undefined;

        await snapAction({
          computer_ids: [instanceId],
          action: "hold",
          snaps: installedSnaps.map((snap) => ({
            name: snap.snap.name,
            time: holdTime,
          })),
          deliver_after: deliverAfter,
          deliver_after_window: !values.randomize_delivery
            ? undefined
            : values.deliver_delay_window,
        });
        closeSidePanel();
        notify.success({
          message: `You queued ${pluralize(installedSnaps.length, ["snap"], "exact")} to be held.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleHoldSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    void formik.setFieldValue("hold", event.currentTarget.value);
    if (event.currentTarget.value === "date") {
      void formik.setFieldValue(
        "hold_until",
        date().toISOString().slice(0, 16),
      );
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {hasOneItem(installedSnaps) ? (
        <p>
          This will pause automatic updates for {installedSnaps[0].snap.name},
          and it will maintain its current version.
        </p>
      ) : (
        <>
          <p>
            Holding a snap will pause automatic updates for that particular
            snap.
          </p>
          {heldSnaps.length > 0 && unheldSnaps.length > 0 && (
            <>
              <span>
                You selected {installedSnaps.length} snaps. This will:
              </span>
              <ul>
                <li>
                  hold{" "}
                  <PluralizeWithBoldCount
                    count={unheldSnaps.length}
                    singular="snap"
                  />
                </li>
                <li>
                  leave{" "}
                  <PluralizeWithBoldCount
                    count={heldSnaps.length}
                    singular="snap"
                  />{" "}
                  held
                </li>
              </ul>
            </>
          )}
        </>
      )}
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
          error={getFormikError(formik, "hold_until")}
          {...formik.getFieldProps("hold_until")}
        />
      )}
      <DeliveryBlock formik={formik} />
      <RandomizationBlock formik={formik} />
      <SidePanelFormButtons
        submitButtonText="Hold"
        submitButtonAppearance="positive"
        submitButtonLoading={formik.isSubmitting}
      />
    </Form>
  );
};

export default HoldSnapForm;
