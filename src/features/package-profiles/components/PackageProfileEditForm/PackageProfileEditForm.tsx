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

const Component: FC<PackageProfileSidePanelComponentProps> = ({
  packageProfile: profile,
}) => {
  const debug = useDebug();
  const { sidePath, popSidePath, setPageParams } = usePageParams();
  const { notify } = useNotify();
  const { editPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: editPackageProfile } = editPackageProfileQuery;

  const closeSidePanel = () => {
    setPageParams({ sidePath: [], packageProfile: "" });
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
            hasBackButton={sidePath.length > 1}
            onBackButtonPress={popSidePath}
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

const PackageProfileEditForm: FC = () => (
  <PackageProfileSidePanel Component={Component} />
);

export default PackageProfileEditForm;
