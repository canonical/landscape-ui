import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { SelectOption } from "@/types/SelectOption";
import { CodeSnippet, Form, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import classes from "./AssignAutoInstallFileForm.module.scss";

const sampleAutoInstallFiles = [
  "autoinstall_file1",
  "autoinstall_file2",
  "autoinstall_file3",
  "autoinstall_file4",
];

const AssignAutoInstallFileForm: FC = () => {
  const formik = useFormik({
    initialValues: {
      autoinstallFile: "",
    },
    validationSchema: Yup.object().shape({
      autoinstallFile: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const AUTOINSTALL_FILES: SelectOption[] = [
    {
      label: "Select",
      value: "",
    },
    ...sampleAutoInstallFiles.map((file) => ({
      label: file,
      value: file,
    })),
  ];

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <span>
        This file will only be used during the initial setup of the instance.
        Changing this autoinstall file will not affect instances that are
        already registered in landscape.
      </span>

      <Select
        wrapperClassName={classes.select}
        label="Autoinstall file"
        options={AUTOINSTALL_FILES}
        {...formik.getFieldProps("autoinstallFile")}
      />
      {formik.values.autoinstallFile && (
        <CodeSnippet
          className={classes.code}
          blocks={[
            {
              title: "Code preview",
              code: "autoinstall_file1 contents",
              wrapLines: true,
            },
          ]}
        />
      )}

      <SidePanelFormButtons
        submitButtonDisabled={false}
        submitButtonText="Assign"
      />
    </Form>
  );
};

export default AssignAutoInstallFileForm;
