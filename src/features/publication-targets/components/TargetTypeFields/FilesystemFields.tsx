import { getFormikError } from "@/utils/formikErrors";
import { Input, Select } from "@canonical/react-components";
import type { FormikProps } from "formik";
import type { FC } from "react";
import type { AddPublicationTargetFormValues } from "../AddPublicationTargetForm/constants";
import styles from "./TargetTypeFields.module.scss";
import { LINK_METHOD_OPTIONS } from "../../constants";

interface FilesystemFieldsProps {
  readonly formik: FormikProps<AddPublicationTargetFormValues>;
}

const FilesystemFields: FC<FilesystemFieldsProps> = ({ formik }) => {
  const pathError = getFormikError(formik, ["filesystem", "path"]);

  return (
    <div className={styles.typeFieldsIndent}>
      <Input
        type="text"
        label="Path"
        help={!pathError ? "File system path starting with /" : undefined}
        required
        error={pathError}
        {...formik.getFieldProps("filesystem.path")}
      />
      <Select
        label="Link method"
        options={LINK_METHOD_OPTIONS}
        error={getFormikError(formik, ["filesystem", "linkMethod"])}
        {...formik.getFieldProps("filesystem.linkMethod")}
      />
    </div>
  );
};

export default FilesystemFields;
