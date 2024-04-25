import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import { Button, Form, Input } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useSavedSearches } from "@/hooks/useSavedSearches";

interface SavedSearchCreateFormProps {
  onClose: () => void;
  onSearchSave: () => void;
  search: string;
}

const SavedSearchCreateForm: FC<SavedSearchCreateFormProps> = ({
  onClose,
  onSearchSave,
  search,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { createSavedSearchQuery } = useSavedSearches();

  const { mutateAsync: createSavedSearch } = createSavedSearchQuery;

  const handleSubmit = async ({ name }: { name: string }) => {
    try {
      await createSavedSearch({ search, name, title: name });
      notify.success({
        message: `Saved search ${name} successfully created`,
        title: "Saved search created",
      });
      onSearchSave();
      onClose();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: handleSubmit,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("This field is required")
        .test({
          message:
            "Name must consist of only lowercase alphanumeric characters and hyphens",
          test: (value) => /^[a-z0-9][-a-z0-9]*$/.test(value),
        }),
    }),
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        autoComplete="off"
        autoFocus
        label="Search name"
        {...formik.getFieldProps("name")}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
      />
      <div className="form-buttons">
        <Button type="button" disabled={formik.isSubmitting} onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          appearance="positive"
          aria-label={`Saved search as ${formik.values.name}`}
        >
          Save search
        </Button>
      </div>
    </Form>
  );
};

export default SavedSearchCreateForm;
