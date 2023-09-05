import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Select, Textarea } from "@canonical/react-components";
import { Computer } from "../../../types/Computer";
import useSidePanel from "../../../hooks/useSidePanel";
import classes from "./EditComputer.module.scss";
import useComputers from "../../../hooks/useComputers";
import useDebug from "../../../hooks/useDebug";

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
  computer: Computer;
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
        {...formik.getFieldProps("title")}
        error={formik.touched.title && formik.errors.title}
      />
      <Textarea
        label="Comment"
        aria-label="Comment"
        rows={6}
        {...formik.getFieldProps("comment")}
        error={formik.touched.comment && formik.errors.comment}
      />
      <Select
        label="License"
        aria-label="License"
        required
        {...formik.getFieldProps("license")}
        error={formik.touched.license && formik.errors.license}
        options={[
          { label: "Ubuntu", value: "ubuntu" },
          { label: "CentOS", value: "centos" },
          { label: "Windows", value: "windows" },
        ]}
      />

      <div className={classes.buttons}>
        <Button type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          appearance="positive"
          onSubmit={formik.handleSubmit}
          disabled={renameComputersLoading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditComputer;
