import type { FormikContextType } from "formik";
import moment from "moment";
import type { ChangeEvent } from "react";
import { Input } from "@canonical/react-components";
import type { RunInstanceScriptFormValues } from "../../types";
import classes from "./DeliveryBlock.module.scss";

export type DeliveryProps = Pick<
  RunInstanceScriptFormValues,
  "deliverImmediately" | "deliver_after"
>;

interface DeliveryBlockProps<T extends DeliveryProps> {
  readonly formik: FormikContextType<T>;
}

const DeliveryBlock = <T extends DeliveryProps>({
  formik,
}: DeliveryBlockProps<T>) => {
  const handleDeliveryTimeChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const deliverImmediately = event.currentTarget.value === "true";

    await formik.setFieldValue("deliverImmediately", deliverImmediately);

    if (!deliverImmediately) {
      await formik.setFieldValue(
        "deliver_after",
        moment().toISOString().slice(0, 16),
      );
    }
  };

  return (
    <>
      <span>
        <b>Delivery time</b>
      </span>
      <div className={classes.radioGroup}>
        <Input
          type="radio"
          label="As soon as possible"
          name="deliverImmediately"
          value="true"
          onChange={handleDeliveryTimeChange}
          checked={formik.values.deliverImmediately}
        />
        <Input
          type="radio"
          label="Scheduled"
          name="deliverImmediately"
          value="false"
          onChange={handleDeliveryTimeChange}
          checked={!formik.values.deliverImmediately}
        />
      </div>
      {!formik.values.deliverImmediately && (
        <Input
          label="Deliver after"
          type="datetime-local"
          labelClassName="u-off-screen"
          {...formik.getFieldProps("deliver_after")}
          error={
            formik.touched.deliver_after &&
            typeof formik.errors.deliver_after === "string"
              ? formik.errors.deliver_after
              : undefined
          }
        />
      )}
    </>
  );
};

export default DeliveryBlock;
