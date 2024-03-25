import { FC, useEffect } from "react";
import {
  PackageProfile,
  PackageProfileConstraintType,
} from "@/features/package-profiles/types/PackageProfile";
import { Button, Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { DuplicateFormProps } from "@/features/package-profiles/types";
import AssociationBlock from "@/components/form/AssociationBlock";
import PackageProfileConstraintsBlock from "@/features/package-profiles/PackageProfileConstraintsBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { handleNextStep } from "./helpers";
import { SelectOption } from "@/types/SelectOption";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import usePackageProfiles from "@/features/package-profiles/hooks/usePackageProfiles";
import useNotify from "@/hooks/useNotify";

interface PackageProfileDuplicateFormProps {
  profile: PackageProfile;
}

const PackageProfileDuplicateForm: FC<PackageProfileDuplicateFormProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, changeSidePanelSize, changeSidePanelTitleLabel } =
    useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { createPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: createPackageProfile } = createPackageProfileQuery;

  const { data: getAccessGroupQueryResult, error: getAccessGroupQueryError } =
    getAccessGroupQuery();

  if (getAccessGroupQueryError) {
    debug(getAccessGroupQueryError);
  }

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  accessGroupOptions.unshift({ label: "Select access group", value: "" });

  const handleSubmit = async (values: DuplicateFormProps) => {
    try {
      await createPackageProfile({
        ...values,
        constraints: values.constraints.map(
          ({ constraint, package: pkg, rule, version }) => ({
            constraint: constraint as PackageProfileConstraintType,
            package: pkg,
            rule,
            version,
          }),
        ),
      });

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
      constraints: profile.constraints.map((constraint) => ({
        ...constraint,
        notAnyVersion: !!constraint.version,
      })),
      description: profile.description,
      step: 1,
      tags: profile.tags,
      title: `${profile.title} (copy)`,
    });
  }, [profile]);

  const handleStepChange = async (step: number) => {
    await formik.setFieldValue("step", step);
    changeSidePanelSize(step !== 1 ? "medium" : "small");
    changeSidePanelTitleLabel(`Step ${step} of 2`);
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {formik.values.step === 1 && (
        <>
          <Input
            type="text"
            label="Name"
            required
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
            required
            autoComplete="off"
            {...formik.getFieldProps("description")}
            error={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : undefined
            }
          />

          <Select
            label="Access group"
            {...formik.getFieldProps("access_group")}
            options={accessGroupOptions}
            error={
              formik.touched.access_group && formik.errors.access_group
                ? formik.errors.access_group
                : undefined
            }
          />

          <AssociationBlock formik={formik} />
        </>
      )}

      {formik.values.step === 2 && (
        <PackageProfileConstraintsBlock formik={formik} />
      )}

      <div className="form-buttons">
        {formik.values.step === 1 && (
          <Button
            type="button"
            appearance="positive"
            onClick={() => handleNextStep(formik, handleStepChange)}
          >
            Next
          </Button>
        )}
        {formik.values.step === 2 && (
          <>
            <Button
              type="submit"
              appearance="positive"
              disabled={formik.isSubmitting}
            >
              Duplicate profile
            </Button>
            <Button
              type="button"
              onClick={() => handleStepChange(1)}
              disabled={formik.isSubmitting}
            >
              Back
            </Button>
          </>
        )}
        <Button
          type="button"
          appearance="base"
          onClick={() => closeSidePanel()}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default PackageProfileDuplicateForm;
