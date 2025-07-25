import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNavigateWithSearch from "@/hooks/useNavigateWithSearch";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
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
  const navigateWithSearch = useNavigateWithSearch();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: editPackageProfile } = editPackageProfileQuery;

  const handleSubmit = async (values: EditFormProps) => {
    try {
      await editPackageProfile({
        ...values,
        name: profile.name,
        tags: values.all_computers ? [] : values.tags,
      });

      closeSidePanel();

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
    navigateWithSearch(`../view/${encodeURIComponent(profile.name)}`);
  };

  const cancel = () => {
    navigateWithSearch("..");
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
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
        hasBackButton
        onBackButtonPress={goBack}
        onCancel={cancel}
      />
    </Form>
  );
};

export default PackageProfileEditForm;
