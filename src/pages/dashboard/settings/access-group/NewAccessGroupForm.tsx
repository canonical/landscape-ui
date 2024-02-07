import * as Yup from "yup";
import useDebug from "../../../../hooks/useDebug";
import { useFormik } from "formik";
import { Form, Input, Select } from "@canonical/react-components";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";
import useAccessGroup from "../../../../hooks/useAccessGroup";
import useSidePanel from "../../../../hooks/useSidePanel";

interface FormProps {
  title: string;
  parent: string;
}

const NewAccessGroupForm = () => {
  const { createAccessGroupQuery, getAccessGroupQuery } = useAccessGroup();
  const { mutateAsync, isLoading } = createAccessGroupQuery;
  const { closeSidePanel } = useSidePanel();
  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptions = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    }),
  );

  const debug = useDebug();
  const formik = useFormik<FormProps>({
    initialValues: {
      title: "",
      parent: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        await mutateAsync(values);
        closeSidePanel();
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
        id="new-access-group-title"
        required
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
        {...formik.getFieldProps("title")}
      />
      <Select
        required
        id="Parent"
        label="Parent"
        disabled={isGettingAccessGroups}
        options={[...accessGroupsOptions]}
        {...formik.getFieldProps("parent")}
      />
      <SidePanelFormButtons
        disabled={isLoading}
        submitButtonText="Create"
        removeButtonMargin
      />
    </Form>
  );
};

export default NewAccessGroupForm;
