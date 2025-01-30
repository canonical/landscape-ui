import type { FormikContextType } from "formik";
import { CheckboxInput, Chip } from "@canonical/react-components";
import MultiSelectField from "@/components/form/MultiSelectField";
import type { SelectOption } from "@/types/SelectOption";
import useInstances from "@/hooks/useInstances";
import type { AssociationBlockFormProps } from "./types";
import classes from "./AssociationBlock.module.scss";

interface AssociationBlockProps<T extends AssociationBlockFormProps> {
  readonly formik: FormikContextType<T>;
}

const AssociationBlock = <T extends AssociationBlockFormProps>({
  formik,
}: AssociationBlockProps<T>) => {
  const { getAllInstanceTagsQuery } = useInstances();

  const { data: getAllInstanceTagsQueryResult } = getAllInstanceTagsQuery();

  const tagOptions: SelectOption[] =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  return (
    <div className={classes.container}>
      <p className="p-heading--5">Association</p>
      <CheckboxInput
        label="Associate to all instances"
        {...formik.getFieldProps("all_computers")}
        checked={formik.values.all_computers}
      />
      {!formik.values.all_computers && (
        <>
          <MultiSelectField
            label="Tags"
            labelClassName="u-off-screen"
            disabled={formik.values.all_computers}
            placeholder="Search and add tags"
            {...formik.getFieldProps("tags")}
            items={tagOptions}
            selectedItems={tagOptions.filter(({ value }) =>
              formik.values.tags.includes(value),
            )}
            onItemsUpdate={(items) =>
              formik.setFieldValue(
                "tags",
                items.map(({ value }) => value) as string[],
              )
            }
          />
          <div className={classes.chips}>
            {formik.values.tags.map((tag) => (
              <Chip
                key={tag}
                className="u-no-margin--bottom u-no-margin--right"
                value={tag}
                onDismiss={() =>
                  formik.setFieldValue(
                    "tags",
                    formik.values.tags.filter((t) => t !== tag),
                  )
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AssociationBlock;
