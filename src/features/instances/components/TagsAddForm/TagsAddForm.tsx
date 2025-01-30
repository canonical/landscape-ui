import type { FC } from "react";
import type { Instance } from "@/types/Instance";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import MultiSelectField from "@/components/form/MultiSelectField";
import {
  INITIAL_TAGS_ADD_FORM_VALUES,
  TAGS_ADD_FORM_VALIDATION_SCHEMA,
} from "./constants";
import type { TagsAddFormValues } from "./types";
import useInstances from "@/hooks/useInstances";
import useDebug from "@/hooks/useDebug";
import { getFormikError } from "@/utils/formikErrors";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useSidePanel from "@/hooks/useSidePanel";
import useNotify from "@/hooks/useNotify";

interface TagsAddFormProps {
  readonly selected: Instance[];
}

const TagsAddForm: FC<TagsAddFormProps> = ({ selected }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { addTagsToInstancesQuery, getAllInstanceTagsQuery } = useInstances();

  const { data: getAllInstanceTagsQueryResult } = getAllInstanceTagsQuery();

  const tagOptions =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const { mutateAsync: addTagsToInstances } = addTagsToInstancesQuery;

  const handleSubmit = async ({ tags }: TagsAddFormValues) => {
    try {
      await addTagsToInstances({
        query: selected.map(({ id }) => `id:${id}`).join(" OR "),
        tags,
      });

      closeSidePanel();

      notify.success({
        title: "Tags assigned",
        message: `Tags successfully assigned to ${
          selected.length > 1
            ? `${selected.length} instances`
            : `"${selected[0].title}" instance`
        }`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_TAGS_ADD_FORM_VALUES,
    onSubmit: handleSubmit,
    validationSchema: TAGS_ADD_FORM_VALIDATION_SCHEMA,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <MultiSelectField
        variant="condensed"
        label="Tags"
        required
        items={tagOptions}
        selectedItems={formik.values.tags.map((tag) => ({
          label: tag,
          value: tag,
        }))}
        onItemsUpdate={(items) => {
          formik.setFieldValue(
            "tags",
            items.map(({ value }) => value),
          );
        }}
        {...formik.getFieldProps("tags")}
        error={getFormikError(formik, "tags")}
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Assign"
      />
    </Form>
  );
};

export default TagsAddForm;
