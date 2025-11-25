import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import {
  TagsAddConfirmationModal,
  useEditInstance,
} from "@/features/instances";
import { useGetProfileChanges, useGetTags } from "@/features/tags";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { InstanceWithoutRelation } from "@/types/Instance";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select, Textarea } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";
import TagMultiSelect from "@/components/form/TagMultiSelect";

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

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const formik = useFormik({
    initialValues: {
      title: instance.title,
      comment: instance.comment,
      access_group: instance.access_group,
      tags: instance.tags,
    },
    onSubmit: async (values: FormProps) => {
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
    },
    validationSchema: VALIDATION_SCHEMA,
  });

  const addedTags = formik.values.tags.filter(
    (tag) => !instance.tags.includes(tag),
  );

  const { isFetchingProfileChanges, refetchProfileChanges } =
    useGetProfileChanges(
      {
        instance_ids: [instance.id],
        tags: addedTags,
        limit: 10,
      },
      { enabled: false },
    );

  const submit = async () => {
    if (addedTags.length) {
      const getProfileChangesResponse = await refetchProfileChanges();

      if (!getProfileChangesResponse.isSuccess) {
        debug(getProfileChangesResponse.error);
      } else if (getProfileChangesResponse.data.data.count) {
        openModal();
      } else {
        formik.handleSubmit();
      }
    } else {
      formik.handleSubmit();
    }
  };

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
    <>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="l-form"
        noValidate
      >
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

        <TagMultiSelect
          onTagsChange={async (items) => formik.setFieldValue("tags", items)}
          tags={tagOptions
            .filter(({ value }) => formik.values.tags.includes(value))
            .map(({ value }) => value)}
        />

        <Textarea
          label="Comment"
          rows={3}
          {...formik.getFieldProps("comment")}
          error={getFormikError(formik, "comment")}
        />

        <SidePanelFormButtons
          submitButtonLoading={
            formik.isSubmitting || (addedTags && isFetchingProfileChanges)
          }
          submitButtonText="Save changes"
        />
      </Form>

      {isModalOpen && (
        <TagsAddConfirmationModal
          instances={[instance]}
          tags={addedTags}
          onConfirm={() => {
            formik.handleSubmit();
          }}
          confirmButtonLoading={formik.isSubmitting}
          close={closeModal}
        />
      )}
    </>
  );
};

export default EditInstance;
