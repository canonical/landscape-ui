import { FC } from "react";
import { EditFormProps, PackageProfile } from "../../types";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { usePackageProfiles } from "../../hooks";
import { useFormik } from "formik";
import { Form, Input } from "@canonical/react-components";
import { VALIDATION_SCHEMA } from "./constants";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import AssociationBlock from "@/components/form/AssociationBlock";
import useNotify from "@/hooks/useNotify";

interface PackageProfileEditFormProps {
  profile: PackageProfile;
}

const PackageProfileEditForm: FC<PackageProfileEditFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
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
        message: `Package profile "${profile.name}" updated successfully`,
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

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
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
      />
    </Form>
  );
};

export default PackageProfileEditForm;
