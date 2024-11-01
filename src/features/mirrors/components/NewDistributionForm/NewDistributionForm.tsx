import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import { string } from "yup";
import { useDistributions } from "../../hooks";
import { INITIAL_VALUES } from "./constants";
import { FormProps } from "./types";

const NewDistributionForm: FC = () => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createDistributionQuery, getDistributionsQuery } = useDistributions();
  const { getAccessGroupQuery } = useRoles();

  const { mutateAsync: createDistribution } = createDistributionQuery;
  const { data: getAccessGroupResponse } = getAccessGroupQuery();

  const accessGroupsOptions: SelectOption[] = (
    getAccessGroupResponse?.data ?? []
  ).map((accessGroup) => ({
    label: accessGroup.title,
    value: accessGroup.name,
  }));

  const { data: getDistributionsResponse } = getDistributionsQuery({
    include_latest_sync: true,
  });

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
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
    onSubmit: async (values) => {
      try {
        await createDistribution(values);

        closeSidePanel();
      } catch (error) {
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
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add distribution"
      />
    </Form>
  );
};

export default NewDistributionForm;
