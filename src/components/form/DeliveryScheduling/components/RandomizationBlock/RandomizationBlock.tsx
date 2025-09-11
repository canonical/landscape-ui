import RadioGroup from "@/components/form/RadioGroup";
import { getFormikError } from "@/utils/formikErrors";
import { Input } from "@canonical/react-components";
import type { FormikProps } from "formik";

export interface RandomizationProps {
  randomize_delivery: boolean;
  deliver_delay_window: number;
}

interface RandomizationBlockProps<T extends RandomizationProps> {
  readonly formik: FormikProps<T>;
}

const RandomizationBlock = <T extends RandomizationProps>({
  formik,
}: RandomizationBlockProps<T>) => {
  return (
    <RadioGroup
      label="Randomize delivery over a time window"
      formik={formik}
      field="randomize_delivery"
      inputs={[
        {
          key: "randomize-yes",
          value: true,
          label: "Yes",
          expansion: (
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              label="Delivery delay window"
              labelClassName="u-off-screen"
              help="Time in minutes"
              {...formik.getFieldProps("deliver_delay_window")}
              error={getFormikError(formik, "deliver_delay_window")}
            />
          ),
        },
        {
          key: "randomize-no",
          value: false,
          label: "No",
          onSelect: async () => {
            await formik.setFieldValue("deliver_delay_window", 0);
          },
        },
      ]}
    />
  );
};

export default RandomizationBlock;
