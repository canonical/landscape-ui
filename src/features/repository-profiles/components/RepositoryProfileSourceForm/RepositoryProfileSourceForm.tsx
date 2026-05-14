import type { APTSource } from "../../types";
import type { RepositoryProfileSourceFormValues } from "../../types";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Textarea } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";

interface RepositoryProfileSourceFormProps {
  readonly onSuccess: (source: APTSource) => void;
  readonly onBack: () => void;
  readonly initialValues?: RepositoryProfileSourceFormValues;
}

const RepositoryProfileSourceForm: FC<RepositoryProfileSourceFormProps> = ({
  onSuccess,
  onBack,
  initialValues,
}) => {
  const formik = useFormik<RepositoryProfileSourceFormValues>({
    initialValues: initialValues ?? INITIAL_VALUES,
    validationSchema: getValidationSchema(),
    onSubmit: (values) => {
      const source: APTSource = {
        id: 0,
        access_group: "",
        profiles: [],
        name: values.name,
        line: values.deb_line,
        gpg_key: values.gpg_key_name
          ? {
              id: 0,
              name: values.gpg_key_name,
              key_id: "",
              fingerprint: "",
              has_secret: false,
            }
          : null,
      };
      onSuccess(source);
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Source name"
        help={
          !formik.errors.name
            ? "Name must start with alphanumeric and contain only lowercase letters, numbers, -, or +."
            : undefined
        }
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
        submitButtonText={initialValues ? "Save changes" : "Add source"}
        onCancel={onBack}
      />
    </Form>
  );
};

export default RepositoryProfileSourceForm;
