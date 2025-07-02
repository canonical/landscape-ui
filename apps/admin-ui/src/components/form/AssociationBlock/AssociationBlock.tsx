import MultiSelectField from "@/components/form/MultiSelectField";
import useInstances from "@/hooks/useInstances";
import type { SelectOption } from "@/types/SelectOption";
import { CheckboxInput, Chip } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import classes from "./AssociationBlock.module.scss";
import type { AssociationBlockFormProps } from "./types";

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
    <>
      <p className="u-no-margin--bottom">Association</p>
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
            onItemsUpdate={async (items) =>
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
                onDismiss={async () =>
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
    </>
  );
};

export default AssociationBlock;
