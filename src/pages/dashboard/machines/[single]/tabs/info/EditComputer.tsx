import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Select, Textarea } from "@canonical/react-components";
import { ComputerWithoutRelation } from "../../../../../../types/Computer";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import useDebug from "../../../../../../hooks/useDebug";
import useComputers from "../../../../../../hooks/useComputers";

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

interface EditComputerProps {
  computer: ComputerWithoutRelation;
  license: string;
}

const EditComputer: FC<EditComputerProps> = ({ computer, license }) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();

  const { renameComputersQuery } = useComputers();

  const { mutateAsync: renameComputers, isLoading: renameComputersLoading } =
    renameComputersQuery;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await renameComputers({
          computer_titles: [`${computer.id}:${values.title}`],
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
    if (!computer) {
      return;
    }

    formik.setValues({
      title: computer.title,
      comment: computer.comment,
      license,
    });
  }, [computer]);

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Input
        label="Title"
        aria-label="Title"
        type="text"
        required
        disabled={computer.is_wsl_instance}
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
          disabled={renameComputersLoading}
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

export default EditComputer;
