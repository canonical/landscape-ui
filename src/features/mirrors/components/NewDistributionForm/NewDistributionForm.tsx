import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import type { AccessGroup } from "@/features/access-groups";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import { string } from "yup";
import { useDistributions } from "../../hooks";
import type { Distribution } from "../../types";
import { INITIAL_VALUES } from "./constants";
import type { FormProps } from "./types";

const NewDistributionForm: FC = () => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createDistributionQuery, getDistributionsQuery } = useDistributions();
  const { getAccessGroupQuery } = useRoles();

  const { mutateAsync: createDistribution } = createDistributionQuery;
  const { data: { data: accessGroups } = { data: [] as AccessGroup[] } } =
    getAccessGroupQuery();

  const accessGroupsOptions: SelectOption[] = accessGroups.map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    }),
  );

  const {
    data: { data: getDistributionsResponse } = { data: [] as Distribution[] },
  } = getDistributionsQuery({
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
            return !getDistributionsResponse.some(({ name }) => name == value);
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
        error={getFormikError(formik, "name")}
      />

      <Select
        label="Access group"
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={getFormikError(formik, "access_group")}
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add distribution"
      />
    </Form>
  );
};

export default NewDistributionForm;
