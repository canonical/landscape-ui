import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import type { EditFormProps } from "../../types";
import type { PackageProfileSidePanelComponentProps } from "../PackageProfileSidePanel";
import PackageProfileSidePanel from "../PackageProfileSidePanel";
import { VALIDATION_SCHEMA } from "./constants";

interface PackageProfileEditFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  PackageProfileSidePanelComponentProps & PackageProfileEditFormProps
> = ({ packageProfile: profile, hasBackButton }) => {
  const debug = useDebug();
  const { setPageParams } = usePageParams();
  const { notify } = useNotify();
  const { editPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: editPackageProfile } = editPackageProfileQuery;

  const closeSidePanel = () => {
    setPageParams({ action: "", packageProfile: "" });
  };

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
    setPageParams({ action: "view" });
  };

  return (
    <>
      <SidePanel.Header>Edit {profile.title}</SidePanel.Header>
      <SidePanel.Content>
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

          <AssociationBlock formik={formik} />

          <SidePanelFormButtons
            submitButtonLoading={formik.isSubmitting}
            submitButtonText="Save changes"
            hasBackButton={hasBackButton}
            onBackButtonPress={goBack}
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

const PackageProfileEditForm: FC<PackageProfileEditFormProps> = (props) => (
  <PackageProfileSidePanel
    Component={(componentProps) => <Component {...componentProps} {...props} />}
  />
);

export default PackageProfileEditForm;
