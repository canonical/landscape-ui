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
      error={getFormikError(formik, ["s3", "region"])}
      {...formik.getFieldProps("s3.region")}
    />
    <Input
      type="text"
      label="Bucket name"
      required
      error={getFormikError(formik, ["s3", "bucket"])}
      {...formik.getFieldProps("s3.bucket")}
    />
    <Input
      type="text"
      label="Endpoint"
      error={getFormikError(formik, ["s3", "endpoint"])}
      {...formik.getFieldProps("s3.endpoint")}
    />
    <Input
      type="text"
      label="AWS access key ID"
      required
      error={getFormikError(formik, ["s3", "awsAccessKeyId"])}
      {...formik.getFieldProps("s3.awsAccessKeyId")}
    />
    <Input
      type="text"
      label="AWS secret access key"
      required
      error={getFormikError(formik, ["s3", "awsSecretAccessKey"])}
      {...formik.getFieldProps("s3.awsSecretAccessKey")}
    />
    <Input
      type="text"
      label="Prefix"
      error={getFormikError(formik, ["s3", "prefix"])}
      {...formik.getFieldProps("s3.prefix")}
    />
    <Input
      type="text"
      label="ACL"
      error={getFormikError(formik, ["s3", "acl"])}
      {...formik.getFieldProps("s3.acl")}
    />
    <Input
      type="text"
      label="Storage class"
      error={getFormikError(formik, ["s3", "storageClass"])}
      {...formik.getFieldProps("s3.storageClass")}
    />
    <Input
      type="text"
      label="Encryption method"
      error={getFormikError(formik, ["s3", "encryptionMethod"])}
      {...formik.getFieldProps("s3.encryptionMethod")}
    />
    <CheckboxInput
      label="Disable MultiDel"
      checked={formik.values.s3.disableMultiDel}
      onChange={(e) =>
        formik.setFieldValue(
          "s3.disableMultiDel",
          (e.target as HTMLInputElement).checked,
        )
      }
    />
    <CheckboxInput
      label="Force AWS SIGv2 (disables SIGv4)"
      checked={formik.values.s3.forceSigV2}
      onChange={(e) =>
        formik.setFieldValue(
          "s3.forceSigV2",
          (e.target as HTMLInputElement).checked,
        )
      }
    />
  </div>
);

export default S3Fields;
