import { getFormikError } from "@/utils/formikErrors";
import { CheckboxInput, Input } from "@canonical/react-components";
import type { FormikProps } from "formik";
import type { FC } from "react";
import type { AddPublicationTargetFormValues } from "../AddPublicationTargetForm/constants";
import styles from "./TargetTypeFields.module.scss";

interface S3FieldsProps {
  readonly formik: FormikProps<AddPublicationTargetFormValues>;
}

const S3Fields: FC<S3FieldsProps> = ({ formik }) => (
  <div className={styles.typeFieldsIndent}>
    <Input
      type="text"
      label="Region"
      required
      error={getFormikError(formik, "region")}
      {...formik.getFieldProps("region")}
    />
    <Input
      type="text"
      label="Bucket name"
      required
      error={getFormikError(formik, "bucket")}
      {...formik.getFieldProps("bucket")}
    />
    <Input
      type="text"
      label="Endpoint"
      error={getFormikError(formik, "endpoint")}
      {...formik.getFieldProps("endpoint")}
    />
    <Input
      type="text"
      label="AWS access key ID"
      required
      error={getFormikError(formik, "awsAccessKeyId")}
      {...formik.getFieldProps("awsAccessKeyId")}
    />
    <Input
      type="text"
      label="AWS secret access key"
      required
      error={getFormikError(formik, "awsSecretAccessKey")}
      {...formik.getFieldProps("awsSecretAccessKey")}
    />
    <Input
      type="text"
      label="Prefix"
      error={getFormikError(formik, "s3Prefix")}
      {...formik.getFieldProps("s3Prefix")}
    />
    <Input
      type="text"
      label="ACL"
      error={getFormikError(formik, "acl")}
      {...formik.getFieldProps("acl")}
    />
    <Input
      type="text"
      label="Storage class"
      error={getFormikError(formik, "storageClass")}
      {...formik.getFieldProps("storageClass")}
    />
    <Input
      type="text"
      label="Encryption method"
      error={getFormikError(formik, "encryptionMethod")}
      {...formik.getFieldProps("encryptionMethod")}
    />
    <CheckboxInput
      label="Disable MultiDel"
      checked={formik.values.disableMultiDel}
      onChange={(e) =>
        formik.setFieldValue(
          "disableMultiDel",
          (e.target as HTMLInputElement).checked,
        )
      }
    />
    <CheckboxInput
      label="Force AWS SIGv2 (disables SIGv4)"
      checked={formik.values.forceSigV2}
      onChange={(e) =>
        formik.setFieldValue(
          "forceSigV2",
          (e.target as HTMLInputElement).checked,
        )
      }
    />
  </div>
);

export default S3Fields;
