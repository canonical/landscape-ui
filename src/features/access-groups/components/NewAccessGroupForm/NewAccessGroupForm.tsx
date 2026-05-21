import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";

const NewAccessGroupForm: FC = () => {
  const { createAccessGroupQuery, getAccessGroupQuery } = useRoles();
  const { mutateAsync } = createAccessGroupQuery;
  const { popSidePathUntilClear } = usePageParams();
  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptionsResults = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    }),
  );

  const debug = useDebug();
  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await mutateAsync(values);
        popSidePathUntilClear();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Title"
        required
        error={getFormikError(formik, "title")}
        {...formik.getFieldProps("title")}
      />
      <Select
        required
        label="Parent"
        disabled={isGettingAccessGroups}
        options={accessGroupsOptionsResults}
        error={getFormikError(formik, "parent")}
        {...formik.getFieldProps("parent")}
      />
      <SidePanelFormButtons
        onCancel={popSidePathUntilClear}
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add access group"
      />
    </Form>
  );
};

export default NewAccessGroupForm;
