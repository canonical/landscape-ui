import type { FormikContextType } from "formik";
import moment from "moment";
import { Input } from "@canonical/react-components";
import { getFormikError } from "@/utils/formikErrors";
import RadioGroup from "@/components/form/RadioGroup";

export interface DeliveryProps {
  deliver_immediately: boolean;
  deliver_after: string;
}

interface DeliveryBlockProps<T extends DeliveryProps> {
  readonly formik: FormikContextType<T>;
}

const DeliveryBlock = <T extends DeliveryProps>({
  formik,
}: DeliveryBlockProps<T>) => {
  return (
    <RadioGroup
      label="Delivery time"
      formik={formik}
      field="deliver_immediately"
      inputs={[
        {
          key: "delivery-asap",
          value: true,
          label: "As soon as possible",
        },
        {
          key: "delivery-scheduled",
          value: false,
          label: "Scheduled",
          onSelect: async () => {
            await formik.setFieldValue(
              "deliver_after",
              moment().add(5, "minutes").toISOString().slice(0, 16),
            );
          },
          expansion: (
            <Input
              label="Deliver after"
              type="datetime-local"
              labelClassName="u-off-screen"
              {...formik.getFieldProps("deliver_after")}
              error={getFormikError(formik, "deliver_after")}
            />
          ),
        },
      ]}
    />
  );
};

export default DeliveryBlock;
