import MultiSelectField from "@/components/form/MultiSelectField";
import { Select } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { ScheduleBlockFormProps } from "../../types";
import { DAY_OPTIONS, MONTH_OPTIONS } from "../ScheduleBlockBase/constants";
import { getOnOptions } from "../ScheduleBlockBase/helpers";

interface OnSelectProps<T extends ScheduleBlockFormProps> {
  readonly formik: FormikContextType<T>;
}

const OnSelect = <T extends ScheduleBlockFormProps>({
  formik,
}: OnSelectProps<T>) => {
  switch (formik.values.unit_of_time) {
    case "weeks":
      return (
        <MultiSelectField
          variant="condensed"
          label="On"
          items={DAY_OPTIONS}
          selectedItems={DAY_OPTIONS.filter(({ value }) =>
            formik.values.on.includes(value),
          )}
          onItemsUpdate={async (items) =>
            formik.setFieldValue(
              "on",
              items.map(({ value }) => value),
            )
          }
          scrollOverflow={true}
          required
        />
      );

    case "months":
      return (
        !!formik.values.start_date && (
          <Select
            label="On"
            options={getOnOptions(new Date(formik.values.start_date))}
            required
          />
        )
      );

    case "years":
      return (
        <MultiSelectField
          variant="condensed"
          label="On"
          items={MONTH_OPTIONS}
          selectedItems={MONTH_OPTIONS.filter(({ value }) =>
            formik.values.on.includes(value),
          )}
          onItemsUpdate={async (items) =>
            formik.setFieldValue(
              "on",
              items.map(({ value }) => value),
            )
          }
          scrollOverflow={true}
          required
        />
      );
  }
};

export default OnSelect;
