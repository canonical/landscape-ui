import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import { usePublicationTargets } from "../../hooks";
import type { PublicationTarget, S3Target } from "../../types";
import {
  CheckboxInput,
  Form,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";

interface EditTargetFormProps {
  readonly target: PublicationTarget;
}

const VALIDATION_SCHEMA = Yup.object().shape({
  display_name: Yup.string().required("This field is required"),
  bucket: Yup.string().required("This field is required"),
  aws_access_key_id: Yup.string().required("This field is required"),
  aws_secret_access_key: Yup.string().required("This field is required"),
  region: Yup.string(),
  endpoint: Yup.string(),
  prefix: Yup.string(),
  acl: Yup.string(),
  storage_class: Yup.string(),
  encryption_method: Yup.string(),
  disable_multi_del: Yup.boolean(),
  force_sig_v2: Yup.boolean(),
});

const getS3InitialValues = (s3: S3Target | undefined) => {
  if (!s3) {
    return {
      region: "",
      bucket: "",
      endpoint: "",
      aws_access_key_id: "",
      aws_secret_access_key: "",
      prefix: "",
      acl: "",
      storage_class: "",
      encryption_method: "",
      disable_multi_del: false,
      force_sig_v2: false,
    };
  }
  return {
    region: s3.region ?? "",
    bucket: s3.bucket,
    endpoint: s3.endpoint ?? "",
    aws_access_key_id: s3.aws_access_key_id,
    aws_secret_access_key: s3.aws_secret_access_key,
    prefix: s3.prefix ?? "",
    acl: s3.acl ?? "",
    storage_class: s3.storage_class ?? "",
    encryption_method: s3.encryption_method ?? "",
    disable_multi_del: s3.disable_multi_del ?? false,
    force_sig_v2: s3.force_sig_v2 ?? false,
  };
};

const getInitialValues = (target: PublicationTarget) => ({
  display_name: target.display_name ?? "",
  ...getS3InitialValues(target.s3),
});

const EditTargetForm: FC<EditTargetFormProps> = ({ target }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { editPublicationTargetQuery } = usePublicationTargets();
  const { mutateAsync: editTarget } = editPublicationTargetQuery;

  const handleSubmit = async (values: ReturnType<typeof getInitialValues>) => {
    try {
      await editTarget({
        name: target.name,
        display_name: values.display_name,
        s3: {
          bucket: values.bucket,
          aws_access_key_id: values.aws_access_key_id,
          aws_secret_access_key: values.aws_secret_access_key,
          ...(values.region && { region: values.region }),
          ...(values.endpoint && { endpoint: values.endpoint }),
          ...(values.prefix && { prefix: values.prefix }),
          ...(values.acl && { acl: values.acl }),
          ...(values.storage_class && { storage_class: values.storage_class }),
          ...(values.encryption_method && {
            encryption_method: values.encryption_method,
          }),
          disable_multi_del: values.disable_multi_del,
          force_sig_v2: values.force_sig_v2,
        },
      });
      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(target),
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
        required
        error={getFormikError(formik, "display_name")}
        {...formik.getFieldProps("display_name")}
      />
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
        required
        error={getFormikError(formik, "endpoint")}
        {...formik.getFieldProps("endpoint")}
      />
      <Input
        type="text"
        label="AWS access key ID"
        required
        error={getFormikError(formik, "aws_access_key_id")}
        {...formik.getFieldProps("aws_access_key_id")}
      />
      <Input
        type="password"
        label="AWS secret access key"
        required
        error={getFormikError(formik, "aws_secret_access_key")}
        {...formik.getFieldProps("aws_secret_access_key")}
      />
      <Input
        type="text"
        label="Prefix"
        error={getFormikError(formik, "prefix")}
        {...formik.getFieldProps("prefix")}
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
        error={getFormikError(formik, "storage_class")}
        {...formik.getFieldProps("storage_class")}
      />
      <Input
        type="text"
        label="Encryption method"
        error={getFormikError(formik, "encryption_method")}
        {...formik.getFieldProps("encryption_method")}
      />
      <CheckboxInput
        label="Disable MultiDel"
        checked={formik.values.disable_multi_del}
        onChange={(e) =>
          formik.setFieldValue(
            "disable_multi_del",
            (e.target as HTMLInputElement).checked,
          )
        }
      />
      <CheckboxInput
        label="Force AWS SIGv2 (disables SIGv4)"
        checked={formik.values.force_sig_v2}
        onChange={(e) =>
          formik.setFieldValue(
            "force_sig_v2",
            (e.target as HTMLInputElement).checked,
          )
        }
      />
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditTargetForm;
