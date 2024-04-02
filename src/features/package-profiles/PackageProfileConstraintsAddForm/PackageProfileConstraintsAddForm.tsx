import { useFormik } from "formik";
import { FC, Suspense } from "react";
import { Button, Form } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import PackageProfileConstraintsBlock from "@/features/package-profiles/PackageProfileConstraintsBlock";
import PackageProfileConstraintsEditForm from "@/features/package-profiles/PackageProfileConstraintsEditForm";
import { EMPTY_CONSTRAINT } from "@/features/package-profiles/constants";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import {
  ConstraintsFormProps,
  PackageProfile,
} from "@/features/package-profiles/types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { VALIDATION_SCHEMA } from "./constants";

interface PackageProfileConstraintsAddFormProps {
  profile: PackageProfile;
}

const PackageProfileConstraintsAddForm: FC<
  PackageProfileConstraintsAddFormProps
> = ({ profile }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { addPackageProfileConstraintsQuery } = usePackageProfiles();

  const { mutateAsync: addConstraints } = addPackageProfileConstraintsQuery;

  const handleConstraintsEdit = () => {
    setSidePanelContent(
      `Edit "${profile.name}" profile's constraints`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const handleSubmit = async ({ constraints }: ConstraintsFormProps) => {
    try {
      await addConstraints({
        name: profile.name,
        constraints: constraints.map(
          ({ constraint, package: packageName, rule, version }) => ({
            constraint,
            package: packageName,
            rule,
            version,
          }),
        ),
      });

      handleConstraintsEdit();

      notify.success({
        message: `${constraints.length} package profile ${constraints.length > 1 ? "constraints" : "constraint"}  added successfully`,
        title: "Package profile constraints added",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<ConstraintsFormProps>({
    initialValues: {
      constraints: [EMPTY_CONSTRAINT],
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <PackageProfileConstraintsBlock formik={formik} />

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          disabled={formik.isSubmitting}
          aria-label={`Add ${formik.values.constraints.length > 1 ? "constraints" : "constraint"} to "${profile.name}" profile`}
        >
          {`Add ${formik.values.constraints.length > 1 ? "constraints" : "constraint"}`}
        </Button>
        <Button
          type="button"
          onClick={handleConstraintsEdit}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default PackageProfileConstraintsAddForm;
