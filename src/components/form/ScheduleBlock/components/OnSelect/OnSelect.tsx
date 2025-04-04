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
  formik: { values, ...formik },
}: OnSelectProps<T>) => {
  switch (values.unit_of_time) {
    case "WEEKLY": {
      return (
        <MultiSelectField
          variant="condensed"
          label="On"
          items={[...DAY_OPTIONS]}
          selectedItems={DAY_OPTIONS.filter(({ value }) =>
            values.days.includes(value),
          )}
          onItemsUpdate={async (items) =>
            formik.setFieldValue(
              "days",
              items.map(({ value }) => value),
            )
          }
          scrollOverflow={true}
          required
        />
      );
    }

    case "MONTHLY": {
      return (
        !!values.start_date && (
          <Select
            label="On"
            options={getOnOptions(new Date(values.start_date))}
            {...formik.getFieldProps("day_of_month_type")}
            required
          />
        )
      );
    }

    case "YEARLY": {
      return (
        <MultiSelectField
          variant="condensed"
          label="On"
          items={[...MONTH_OPTIONS]}
          selectedItems={MONTH_OPTIONS.filter(({ value }) =>
            values.months.includes(value),
          )}
          onItemsUpdate={async (items) =>
            formik.setFieldValue(
              "months",
              items.map(({ value }) => value),
            )
          }
          scrollOverflow={true}
          required
        />
      );
    }
  }
};

export default OnSelect;
