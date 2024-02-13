import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Select, Textarea } from "@canonical/react-components";
import { InstanceWithoutRelation } from "../../../../../../types/Instance";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import useDebug from "../../../../../../hooks/useDebug";
import useInstances from "../../../../../../hooks/useInstances";

interface FormProps {
  title: string;
  comment: string;
  license: string;
}

const initialValues: FormProps = {
  title: "",
  comment: "",
  license: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("This field is required."),
  comment: Yup.string(),
  license: Yup.string().required("This field is required."),
});

interface EditInstanceProps {
  instance: InstanceWithoutRelation;
  license: string;
}

const EditInstance: FC<EditInstanceProps> = ({ instance, license }) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();

  const { renameInstancesQuery } = useInstances();

  const { mutateAsync: renameInstances, isLoading: renameInstancesLoading } =
    renameInstancesQuery;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await renameInstances({
          computer_titles: [`${instance.id}:${values.title}`],
        });
      } catch (error) {
        debug(error);
      } finally {
        closeSidePanel();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    closeSidePanel();
  };

  useEffect(() => {
    if (!instance) {
      return;
    }

    formik.setValues({
      title: instance.title,
      comment: instance.comment,
      license,
    });
  }, [instance]);

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Input
        label="Title"
        aria-label="Title"
        type="text"
        required
        disabled={instance.is_wsl_instance}
        {...formik.getFieldProps("title")}
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
      />
      <Textarea
        label="Comment"
        aria-label="Comment"
        rows={6}
        {...formik.getFieldProps("comment")}
        error={
          formik.touched.comment && formik.errors.comment
            ? formik.errors.comment
            : undefined
        }
      />
      <Select
        label="License"
        aria-label="License"
        required
        {...formik.getFieldProps("license")}
        error={
          formik.touched.license && formik.errors.license
            ? formik.errors.license
            : undefined
        }
        options={[
          {
            label: "Landscape, 234 days left, 9 seats free",
            value: "",
          },
        ]}
      />

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          onSubmit={formik.handleSubmit}
          disabled={renameInstancesLoading}
        >
          Save
        </Button>
        <Button type="button" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditInstance;
