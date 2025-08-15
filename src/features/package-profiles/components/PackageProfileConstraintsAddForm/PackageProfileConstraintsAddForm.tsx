import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { EMPTY_CONSTRAINT } from "../../constants";
import { usePackageProfiles } from "../../hooks";
import type { ConstraintsFormProps, PackageProfile } from "../../types";
import PackageProfileConstraintsBlock from "../PackageProfileConstraintsBlock";
import { VALIDATION_SCHEMA } from "./constants";

interface PackageProfileConstraintsAddFormProps {
  readonly profile: PackageProfile;
}

const PackageProfileConstraintsAddForm: FC<
  PackageProfileConstraintsAddFormProps
> = ({ profile }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();
  const { addPackageProfileConstraintsQuery } = usePackageProfiles();

  const { mutateAsync: addConstraints } = addPackageProfileConstraintsQuery;

  const goBack = () => {
    setPageParams({ action: "constraints" });
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

      goBack();

      notify.success({
        message: `${constraints.length} package profile ${pluralize(constraints.length, "constraint")}  added successfully`,
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
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={`Add ${pluralize(formik.values.constraints.length, "constraint")}`}
        submitButtonAriaLabel={`Add ${pluralize(formik.values.constraints.length, "constraint")} to "${profile.title}" profile`}
        cancelButtonDisabled={formik.isSubmitting}
        hasBackButton
        onBackButtonPress={goBack}
        onCancel={() => {
          setPageParams({ action: "", packageProfile: "" });
        }}
      />
    </Form>
  );
};

export default PackageProfileConstraintsAddForm;
