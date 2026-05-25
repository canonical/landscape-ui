import AssociationBlock from "@/components/form/AssociationBlock";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { getTitleByName } from "@/utils/_helpers";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { usePackageProfiles } from "../../../../hooks";
import type { EditFormProps, PackageProfile } from "../../../../types";
import { VALIDATION_SCHEMA } from "./constants";

interface PackageProfileEditFormProps {
  readonly profile: PackageProfile;
}

const PackageProfileEditForm: FC<PackageProfileEditFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { closeSidePanel, popSidePathUntilClear } = usePageParams();
  const { notify } = useNotify();
  const { editPackageProfileQuery } = usePackageProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: accessGroupsData } = getAccessGroupQuery();
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
      description: profile.description ?? "",
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
        label="Title"
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <Input
        type="text"
        label="Description"
        {...formik.getFieldProps("description")}
      />

      <ReadOnlyField
        label="Access group"
        value={getTitleByName(profile.access_group, accessGroupsData)}
        tooltipMessage="You can't change the access group after the package profile has been created"
      />

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting}
        submitButtonText="Save changes"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default PackageProfileEditForm;
