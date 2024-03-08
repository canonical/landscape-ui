import { FC } from "react";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { string } from "yup";
import useDebug from "@/hooks/useDebug";
import useDistributions from "@/hooks/useDistributions";
import useSidePanel from "@/hooks/useSidePanel";
import useRoles from "@/hooks/useRoles";
import { SelectOption } from "@/types/SelectOption";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";

const NewDistributionForm: FC = () => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { createDistributionQuery, getDistributionsQuery } = useDistributions();
  const { getAccessGroupQuery } = useRoles();
  const { mutateAsync: createDistribution, isLoading: isCreatingDistribution } =
    createDistributionQuery;
  const { data: getAccessGroupResponse, error: getAccessGroupError } =
    getAccessGroupQuery();

  if (getAccessGroupError) {
    debug(getAccessGroupError);
  }

  const accessGroupsOptions: SelectOption[] = (
    getAccessGroupResponse?.data ?? []
  ).map((accessGroup) => ({
    label: accessGroup.title,
    value: accessGroup.name,
  }));

  const { data: getDistributionsResponse, error: getDistributionsError } =
    getDistributionsQuery();

  if (getDistributionsError) {
    debug(getDistributionsError);
  }

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      name: string()
        .required("This field is required.")
        .test({
          test: testLowercaseAlphaNumeric.test,
          message: testLowercaseAlphaNumeric.message,
        })
        .test({
          params: { getDistributionsResponse },
          test: (value) => {
            return !(getDistributionsResponse?.data ?? [])
              .map(({ name }) => name)
              .includes(value);
          },
          message: "It must be unique within the account.",
        }),
      access_group: Yup.string(),
    }),
    initialValues: {
      name: "",
      access_group: "",
    },
    onSubmit: async (values) => {
      try {
        await createDistribution(values);

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Distribution name"
        required
        {...formik.getFieldProps("name")}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
      />

      <Select
        label="Access group"
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      <SidePanelFormButtons
        disabled={isCreatingDistribution}
        submitButtonText="Create distribution"
      />
    </Form>
  );
};

export default NewDistributionForm;
