import type { FC } from "react";
import { useFormik } from "formik";
import { Form, Input, Select, Textarea } from "@canonical/react-components";
import type { InstanceWithoutRelation } from "@/types/Instance";
import useSidePanel from "@/hooks/useSidePanel";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";

interface EditInstanceProps {
  readonly instance: InstanceWithoutRelation;
}

const EditInstance: FC<EditInstanceProps> = ({ instance }) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { getAccessGroupQuery } = useRoles();
  const { editInstanceQuery } = useInstances();

  const { mutateAsync: editInstance } = editInstanceQuery;

  const handleSubmit = async (values: FormProps) => {
    try {
      await editInstance({
        instanceId: instance.id,
        ...values,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeSidePanel();
    }
  };

  const formik = useFormik({
    initialValues: {
      title: instance.title,
      comment: instance.comment,
      access_group: instance.access_group,
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
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
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
      />

      <Select
        label="Access group"
        options={accessGroupOptions}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      <Textarea
        label="Comment"
        rows={5}
        {...formik.getFieldProps("comment")}
        error={
          formik.touched.comment && formik.errors.comment
            ? formik.errors.comment
            : undefined
        }
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditInstance;
