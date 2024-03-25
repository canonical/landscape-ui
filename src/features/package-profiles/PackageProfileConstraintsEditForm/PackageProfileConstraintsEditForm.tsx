import { FC, useEffect } from "react";
import {
  PackageProfile,
  PackageProfileConstraintType,
} from "@/features/package-profiles/types/PackageProfile";
import { useFormik } from "formik";
import PackageProfileConstraintsBlock from "@/features/package-profiles/PackageProfileConstraintsBlock";
import {
  Constraint,
  ConstraintsEditFormProps,
} from "@/features/package-profiles/types";
import { Form } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import usePackageProfiles from "@/features/package-profiles/hooks/usePackageProfiles";
import { VALIDATION_SCHEMA } from "./constants";
import useNotify from "@/hooks/useNotify";

interface PackageProfileConstraintsEditFormProps {
  profile: PackageProfile;
}

const PackageProfileConstraintsEditForm: FC<
  PackageProfileConstraintsEditFormProps
> = ({ profile }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editPackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: editPackageProfile } = editPackageProfileQuery;

  const handleSubmit = async (values: ConstraintsEditFormProps) => {
    try {
      await editPackageProfile({
        constraints: values.constraints.map(
          ({ constraint, package: pkg, rule, version }) => ({
            constraint: constraint as PackageProfileConstraintType,
            package: pkg,
            rule,
            version,
          }),
        ),
        name: profile.name,
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

  const formik = useFormik<ConstraintsEditFormProps>({
    initialValues: {
      constraints: [],
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  useEffect(() => {
    formik.setFieldValue(
      "constraints",
      profile.constraints.map(
        (constraint): Constraint => ({
          ...constraint,
          notAnyVersion: !!constraint.version,
        }),
      ),
    );
  }, [profile.constraints]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <PackageProfileConstraintsBlock formik={formik} />
      <SidePanelFormButtons
        disabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default PackageProfileConstraintsEditForm;
