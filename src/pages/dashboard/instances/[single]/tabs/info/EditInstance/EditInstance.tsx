import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { useEditInstance, useGetTags } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { InstanceWithoutRelation } from "@/types/Instance";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import {
  Chip,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { VALIDATION_SCHEMA } from "./constants";
import classes from "./EditInstance.module.scss";
import type { FormProps } from "./types";

interface EditInstanceProps {
  readonly instance: InstanceWithoutRelation;
}

const EditInstance: FC<EditInstanceProps> = ({ instance }) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult, isPending: isGettingAccessGroups } =
    getAccessGroupQuery();
  const { tags, isGettingTags } = useGetTags();
  const { editInstance } = useEditInstance();

  const handleSubmit = async (values: FormProps) => {
    try {
      await editInstance({
        instanceId: instance.id,
        ...values,
      });

      closeSidePanel();

      notify.success({
        title: "Instance updated",
        message: `Instance "${instance.title}" updated successfully`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: instance.title,
      comment: instance.comment,
      access_group: instance.access_group,
      tags: instance.tags,
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  if (isGettingAccessGroups || isGettingTags) {
    return <LoadingState />;
  }

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const tagOptions: SelectOption[] =
    tags.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  return (
    <Form onSubmit={formik.handleSubmit} className="l-form" noValidate>
      <Input
        label="Title"
        aria-label="Title"
        type="text"
        required
        disabled={instance.is_wsl_instance}
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <Select
        label="Access group"
        options={accessGroupOptions}
        {...formik.getFieldProps("access_group")}
        error={getFormikError(formik, "access_group")}
      />

      <MultiSelectField
        label="Tags"
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

      <Textarea
        label="Comment"
        rows={3}
        {...formik.getFieldProps("comment")}
        error={getFormikError(formik, "comment")}
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditInstance;
