import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import useCreatePublicationTarget from "../../api/useCreatePublicationTarget";
import {
  CheckboxInput,
  Form,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import { INITIAL_VALUES } from "./constants";
import type { AddPublicationTargetFormValues } from "./constants";

const AddPublicationTargetForm: FC = () => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createPublicationTargetQuery } = useCreatePublicationTarget();

  const { mutateAsync } = createPublicationTargetQuery;

  const formik = useFormik<AddPublicationTargetFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: Yup.object().shape({
      displayName: Yup.string().required("This field is required"),
      bucket: Yup.string().required("This field is required"),
      awsAccessKeyId: Yup.string().required("This field is required"),
      awsSecretAccessKey: Yup.string().required("This field is required"),
      region: Yup.string(),
      endpoint: Yup.string(),
      prefix: Yup.string(),
      acl: Yup.string(),
      storageClass: Yup.string(),
      encryptionMethod: Yup.string(),
      disableMultiDel: Yup.boolean(),
      forceSigV2: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          displayName: values.displayName,
          s3: {
            ...(values.region && { region: values.region }),
            bucket: values.bucket,
            awsAccessKeyId: values.awsAccessKeyId,
            awsSecretAccessKey: values.awsSecretAccessKey,
            ...(values.endpoint && { endpoint: values.endpoint }),
            ...(values.prefix && { prefix: values.prefix }),
            ...(values.acl && { acl: values.acl }),
            ...(values.storageClass && { storageClass: values.storageClass }),
            ...(values.encryptionMethod && {
              encryptionMethod: values.encryptionMethod,
            }),
            disableMultiDel: values.disableMultiDel,
            forceSigV2: values.forceSigV2,
          },
        });
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
        required
        error={getFormikError(formik, "displayName")}
        {...formik.getFieldProps("displayName")}
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
        type="password"
        label="AWS secret access key"
        required
        error={getFormikError(formik, "awsSecretAccessKey")}
        {...formik.getFieldProps("awsSecretAccessKey")}
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
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add publication target"
      />
    </Form>
  );
};

export default AddPublicationTargetForm;
