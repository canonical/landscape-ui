import { getFormikError } from "@/utils/formikErrors";
import { Input, Select } from "@canonical/react-components";
import type { FormikProps } from "formik";
import type { FC } from "react";
import type { AddPublicationTargetFormValues } from "../AddPublicationTargetForm/constants";
import styles from "./TargetTypeFields.module.scss";

const LINK_METHOD_OPTIONS = [
  { value: "", label: "Select a link method" },
  { value: "HARDLINK", label: "Hardlink" },
  { value: "SYMLINK", label: "Symlink" },
  { value: "COPY", label: "Copy" },
];

interface FilesystemFieldsProps {
  readonly formik: FormikProps<AddPublicationTargetFormValues>;
}

const FilesystemFields: FC<FilesystemFieldsProps> = ({ formik }) => (
  <div className={styles.typeFieldsIndent}>
    <Input
      type="text"
      label="Path"
      help={!getFormikError(formik, "path") ? "File system path starting with /" : undefined}
      required
      error={getFormikError(formik, "path")}
      {...formik.getFieldProps("path")}
    />
    <Select
      label="Link method"
      options={LINK_METHOD_OPTIONS}
      error={getFormikError(formik, "linkMethod")}
      {...formik.getFieldProps("linkMethod")}
    />
  </div>
);

export default FilesystemFields;
