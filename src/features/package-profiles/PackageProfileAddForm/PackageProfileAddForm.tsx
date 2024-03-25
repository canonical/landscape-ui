import { useFormik } from "formik";
import { FC } from "react";
import { Button, Form, Input, Select } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import usePackageProfiles, {
  CreatePackageProfileParams,
} from "@/features/package-profiles/hooks/usePackageProfiles";
import useSidePanel from "@/hooks/useSidePanel";
import PackageProfileConstraintsTypeBlock from "@/features/package-profiles/PackageProfileConstraintsTypeBlock";
import { AddFormProps } from "@/features/package-profiles/types";
import useRoles from "@/hooks/useRoles";
import { SelectOption } from "@/types/SelectOption";
import PackageProfileConstraintsBlock from "@/features/package-profiles/PackageProfileConstraintsBlock";
import AssociationBlock from "@/components/form/AssociationBlock";
import { CTA_LABELS, INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { handleNextStep } from "./helpers";
import { PackageProfileConstraintType } from "@/features/package-profiles/types/PackageProfile";
import useNotify from "@/hooks/useNotify";

interface PackageProfileAddFormProps {
  action?: "add" | "create";
}

const PackageProfileAddForm: FC<PackageProfileAddFormProps> = ({
  action = "add",
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, changeSidePanelSize, changeSidePanelTitleLabel } =
    useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const {
    createPackageProfileQuery,
    getInstanceConstraintsQuery,
    parsePackageProfileConstraintsQuery,
  } = usePackageProfiles();

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

  const { mutateAsync: createPackageProfile } = createPackageProfileQuery;

  const handleSubmit = async (values: AddFormProps) => {
    const valuesToProfileCreation: CreatePackageProfileParams = {
      access_group: values.access_group,
      constraints: values.constraints.map(
        ({ constraint, package: package_name, rule, version }) => ({
          constraint: constraint as PackageProfileConstraintType,
          package: package_name,
          rule,
          version,
        }),
      ),
      description: values.description,
      title: values.title,
    };

    if (values.all_computers) {
      valuesToProfileCreation.all_computers = true;
    } else if (values.tags.length > 0) {
      valuesToProfileCreation.tags = values.tags;
    }

    try {
      await createPackageProfile(valuesToProfileCreation);

      closeSidePanel();

      notify.success({
        message: `Profile "${values.title}" created successfully`,
        title: "Profile created",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const {
    data: getInstanceConstraintsQueryResult,
    error: getInstanceConstraintsQueryError,
  } = getInstanceConstraintsQuery(
    {
      instanceId: formik.values.instanceId,
    },
    {
      enabled: formik.values.instanceId > 0,
    },
  );

  if (getInstanceConstraintsQueryError) {
    debug(getInstanceConstraintsQueryError);
  }

  const { mutateAsync: parsePackageProfileConstraints } =
    parsePackageProfileConstraintsQuery;

  const handleParseConstraints = async () => {
    try {
      const parsedConstraints = await parsePackageProfileConstraints({
        material: formik.values.material,
      });

      await formik.setFieldValue("constraints", parsedConstraints.data.result);
      await formik.setFieldValue("isCsvFileParsed", true);
    } catch (error) {
      debug(error);
    }
  };

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

          <PackageProfileConstraintsTypeBlock formik={formik} />

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
            onClick={() =>
              handleNextStep(
                formik,
                handleParseConstraints,
                getInstanceConstraintsQueryResult?.data.result ?? [],
                handleStepChange,
              )
            }
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
              {CTA_LABELS[action]}
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

export default PackageProfileAddForm;
