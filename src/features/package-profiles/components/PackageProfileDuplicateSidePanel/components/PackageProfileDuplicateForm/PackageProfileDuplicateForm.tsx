import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import {
  usePackageProfiles,
  type CopyPackageProfileParams,
} from "../../../../hooks";
import type { DuplicateFormProps, PackageProfile } from "../../../../types";
import { VALIDATION_SCHEMA } from "./constants";

interface PackageProfileDuplicateFormProps {
  readonly profile: PackageProfile;
}

const PackageProfileDuplicateForm: FC<PackageProfileDuplicateFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
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

  const closeSidePanel = createPageParamsSetter({ sidePath: [], profile: "" });

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
    initialValues: {
      access_group: profile.access_group,
      all_computers: profile.all_computers,
      description: profile.description,
      tags: profile.tags,
      title: `${profile.title} (copy)`,
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  return (
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
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
        onCancel={closeSidePanel}
      />
    </Form>
  );
};

export default PackageProfileDuplicateForm;
