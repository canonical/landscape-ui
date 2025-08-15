import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect } from "react";
import type { CopyPackageProfileParams } from "../../hooks";
import { usePackageProfiles } from "../../hooks";
import type { DuplicateFormProps } from "../../types";
import type { PackageProfileSidePanelComponentProps } from "../PackageProfileSidePanel";
import PackageProfileSidePanel from "../PackageProfileSidePanel";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";

interface PackageProfileDuplicateFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  PackageProfileSidePanelComponentProps & PackageProfileDuplicateFormProps
> = ({ packageProfile: profile, hasBackButton }) => {
  const debug = useDebug();
  const { setPageParams } = usePageParams();
  const { notify } = useNotify();
  const { getAccessGroupQuery } = useRoles();
  const { copyPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: copyPackageProfile } = copyPackageProfileQuery;

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const closeSidePanel = () => {
    setPageParams({ action: "", packageProfile: "" });
  };

  const handleSubmit = async (values: DuplicateFormProps) => {
    const valuesToSubmit: CopyPackageProfileParams = {
      all_computers: values.all_computers,
      access_group: values.access_group,
      copy_from: profile.name,
      description: values.description,
      title: values.title,
    };

    if (!values.all_computers && values.tags.length > 0) {
      valuesToSubmit.tags = values.tags;
    }

    try {
      await copyPackageProfile(valuesToSubmit);

      closeSidePanel();

      notify.success({
        message: `Profile "${profile.title}" duplicated successfully`,
        title: "Profile duplicated",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<DuplicateFormProps>({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    formik.setValues({
      access_group: profile.access_group,
      all_computers: profile.all_computers,
      description: profile.description,
      tags: profile.tags,
      title: `${profile.title} (copy)`,
    });
  }, [profile]);

  const goBack = () => {
    setPageParams({ action: "view" });
  };

  return (
    <>
      <SidePanel.Header>Duplicate {profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Input
            type="text"
            label="Title"
            required
            {...formik.getFieldProps("title")}
            error={getFormikError(formik, "title")}
          />

          <Input
            type="text"
            label="Description"
            required
            autoComplete="off"
            {...formik.getFieldProps("description")}
            error={getFormikError(formik, "description")}
          />

          <Select
            label="Access group"
            {...formik.getFieldProps("access_group")}
            options={accessGroupOptions}
            error={getFormikError(formik, "access_group")}
          />

          <AssociationBlock formik={formik} />

          <SidePanelFormButtons
            submitButtonLoading={formik.isSubmitting}
            submitButtonText="Duplicate"
            hasBackButton={hasBackButton}
            onBackButtonPress={goBack}
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

const PackageProfileDuplicateForm: FC<PackageProfileDuplicateFormProps> = (
  props,
) => (
  <PackageProfileSidePanel
    Component={(componentProps) => <Component {...componentProps} {...props} />}
  />
);

export default PackageProfileDuplicateForm;
