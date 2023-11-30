import { FC } from "react";
import { SavedSearch } from "../../../../types/SavedSearch";
import useDebug from "../../../../hooks/useDebug";
import { useSavedSearches } from "../../../../hooks/useSavedSearches";
import * as Yup from "yup";
import { useFormik } from "formik";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Form, Input } from "@canonical/react-components";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";

interface FormProps extends SavedSearch {}

const INITIAL_VALUES: FormProps = {
  name: "",
  title: "",
  search: "",
};

const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().test({
    test: (value) => {
      if (!value) {
        return true;
      }

      return /^[a-z0-9][-a-z0-9]*$/.test(value);
    },
    message:
      "Name must consist of only lowercase alphanumeric characters and hyphens",
  }),
  title: Yup.string().required("This field is required"),
  search: Yup.string().required("This field is required"),
});

interface SingleSavedSearchProps {
  savedSearch?: SavedSearch;
}

const SingleSavedSearch: FC<SingleSavedSearchProps> = ({ savedSearch }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { createSavedSearchQuery, editSavedSearchQuery } = useSavedSearches();

  const { mutateAsync: createSavedSearch } = createSavedSearchQuery;
  const { mutateAsync: editSavedSearch } = editSavedSearchQuery;

  const formik = useFormik({
    initialValues: savedSearch ? savedSearch : INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        savedSearch
          ? await editSavedSearch(values)
          : await createSavedSearch(values);

        handleClose();
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    closeSidePanel();
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        required
        {...formik.getFieldProps("title")}
        error={formik.touched.title && formik.errors.title}
      />
      <Input
        type="text"
        label="Name"
        placeholder={formik.values.title
          .toLowerCase()
          .replace(/[^-a-z0-9]/g, " ")
          .replace(/\s+/g, "-")}
        {...formik.getFieldProps("name")}
        error={formik.touched.name && formik.errors.name}
      />
      <Input
        type="text"
        label="Search"
        required
        {...formik.getFieldProps("search")}
        error={formik.touched.search && formik.errors.search}
      />

      <SidePanelFormButtons
        disabled={formik.isSubmitting}
        positiveButtonTitle={savedSearch ? "Save changes" : "Create"}
      />
    </Form>
  );
};

export default SingleSavedSearch;
