import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import type { EditFormProps, PackageProfile } from "../../types";
import { VALIDATION_SCHEMA } from "./constants";

interface PackageProfileEditFormProps {
  readonly profile: PackageProfile;
}

const PackageProfileEditForm: FC<PackageProfileEditFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { setPageParams } = usePageParams();
  const { notify } = useNotify();
  const { editPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: editPackageProfile } = editPackageProfileQuery;

  const close = () => {
    setPageParams({ action: "", packageProfile: "" });
  };

  const handleSubmit = async (values: EditFormProps) => {
    try {
      await editPackageProfile({
        ...values,
        name: profile.name,
        tags: values.all_computers ? [] : values.tags,
      });

      close();

      notify.success({
        message: `Package profile "${profile.title}" updated successfully`,
        title: "Package profile updated",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<EditFormProps>({
    enableReinitialize: true,
    initialValues: {
      all_computers: profile.all_computers,
      description: profile.description,
      tags: profile.tags,
      title: profile.title,
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const goBack = () => {
    setPageParams({ action: "view" });
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        {...formik.getFieldProps("title")}
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
      />

      <Input
        type="text"
        label="Description"
        {...formik.getFieldProps("description")}
      />

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting}
        submitButtonText="Save changes"
        hasBackButton
        onBackButtonPress={goBack}
        onCancel={close}
      />
    </Form>
  );
};

export default PackageProfileEditForm;
