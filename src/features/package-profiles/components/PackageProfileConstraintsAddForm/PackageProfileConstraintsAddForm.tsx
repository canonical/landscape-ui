import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { EMPTY_CONSTRAINT } from "../../constants";
import { usePackageProfiles } from "../../hooks";
import type { ConstraintsFormProps } from "../../types";
import PackageProfileConstraintsBlock from "../PackageProfileConstraintsBlock";
import type { PackageProfileSidePanelComponentProps } from "../PackageProfileSidePanel";
import PackageProfileSidePanel from "../PackageProfileSidePanel";
import { VALIDATION_SCHEMA } from "./constants";

const Component: FC<PackageProfileSidePanelComponentProps> = ({
  packageProfile: profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, setPageParams } = usePageParams();
  const { addPackageProfileConstraintsQuery } = usePackageProfiles();

  const { mutateAsync: addConstraints } = addPackageProfileConstraintsQuery;

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

      popSidePath();

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
    <>
      <SidePanel.Header>
        Add package constraints to &quot;${profile.title}&quot; profile
      </SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <PackageProfileConstraintsBlock formik={formik} />
          <SidePanelFormButtons
            submitButtonDisabled={formik.isSubmitting}
            submitButtonText={`Add ${pluralize(formik.values.constraints.length, "constraint")}`}
            submitButtonAriaLabel={`Add ${pluralize(formik.values.constraints.length, "constraint")} to "${profile.title}" profile`}
            cancelButtonDisabled={formik.isSubmitting}
            hasBackButton={sidePath.length > 1}
            onBackButtonPress={popSidePath}
            onCancel={() => {
              setPageParams({ sidePath: [], packageProfile: "" });
            }}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

const PackageProfileConstraintsAddForm: FC = () => (
  <PackageProfileSidePanel Component={Component} />
);

export default PackageProfileConstraintsAddForm;
