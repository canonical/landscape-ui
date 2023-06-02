import { FC } from "react";
import { Button, Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { string } from "yup";
import useDebug from "../../../hooks/useDebug";
import useDistributions from "../../../hooks/useDistributions";
import useSidePanel from "../../../hooks/useSidePanel";
import useAccessGroup from "../../../hooks/useAccessGroup";
import { SelectOption } from "../../../types/SelectOption";

const NewDistributionForm: FC = () => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { createDistributionQuery } = useDistributions();
  const { getAccessGroupQuery } = useAccessGroup();
  const { mutateAsync: createDistribution, isLoading: isCreating } =
    createDistributionQuery;
  const { data: accessGroupsResponse } = getAccessGroupQuery();

  const accessGroupsOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map((accessGroup) => ({
    label: accessGroup.title,
    value: accessGroup.name,
  }));

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      name: string()
        .required("This field is required.")
        .test({
          test: (value) => /^[-+a-z0-9]+$/.test(value),
          message:
            "It must be unique within the account, start with an alphanumeric character and only contain lowercase letters, numbers and - or + signs.",
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
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        required
        label="Distribution name"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
      />

      <Select
        label="Access group"
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={formik.touched.access_group && formik.errors.access_group}
      />

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isCreating}>
          Create distribution
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NewDistributionForm;
