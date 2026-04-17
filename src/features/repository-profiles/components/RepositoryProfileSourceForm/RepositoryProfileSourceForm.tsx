import type { APTSource } from "@/features/apt-sources";
import type { RepositoryProfileSourceFormValues } from "@/features/repository-profiles/types";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Textarea } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";

interface RepositoryProfileSourceFormProps {
  readonly onSuccess: (source: APTSource) => void;
  readonly onCancel: () => void;
}

const RepositoryProfileSourceForm: FC<RepositoryProfileSourceFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const formik = useFormik<RepositoryProfileSourceFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: getValidationSchema(),
    onSubmit: (values) => {
      const source: APTSource = {
        id: 0,
        access_group: "",
        profiles: [],
        name: values.name,
        line: values.deb_line,
        gpg_key: values.gpg_key_name || null,
      };
      onSuccess(source);
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Source name"
        required
        autoComplete="off"
        error={getFormikError(formik, "name")}
        {...formik.getFieldProps("name")}
      />
      <Input
        type="text"
        label="Deb line"
        required
        autoComplete="off"
        placeholder="deb http://archive.ubuntu.com/ubuntu focal main"
        error={getFormikError(formik, "deb_line")}
        {...formik.getFieldProps("deb_line")}
      />
      <Textarea
        label="GPG key"
        error={getFormikError(formik, "gpg_key_name")}
        {...formik.getFieldProps("gpg_key_name")}
      />
      <SidePanelFormButtons
        submitButtonText="Add source"
        onCancel={onCancel}
      />
    </Form>
  );
};

export default RepositoryProfileSourceForm;
