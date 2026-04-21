import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import useEditPublicationTarget from "../../api/useEditPublicationTarget";
import {
  CheckboxInput,
  Form,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import type { PublicationTarget } from "@canonical/landscape-openapi";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import useNotify from "@/hooks/useNotify";

interface EditTargetFormProps {
  readonly target: PublicationTarget;
}

const VALIDATION_SCHEMA = Yup.object().shape({
  displayName: Yup.string().required("This field is required"),
  bucket: Yup.string().required("This field is required"),
  awsAccessKeyId: Yup.string().required("This field is required"),
  awsSecretAccessKey: Yup.string().required("This field is required"),
  region: Yup.string().required("This field is required"),
  endpoint: Yup.string(),
  prefix: Yup.string(),
  acl: Yup.string(),
  storageClass: Yup.string(),
  encryptionMethod: Yup.string(),
  disableMultiDel: Yup.boolean(),
  forceSigV2: Yup.boolean(),
});

const getS3InitialValues = (s3: PublicationTarget["s3"] | undefined) => {
  if (!s3) {
    return {
      region: "",
      bucket: "",
      endpoint: "",
      awsAccessKeyId: "",
      awsSecretAccessKey: "",
      prefix: "",
      acl: "",
      storageClass: "",
      encryptionMethod: "",
      disableMultiDel: false,
      forceSigV2: false,
    };
  }
  return {
    region: s3.region ?? "",
    bucket: s3.bucket,
    endpoint: s3.endpoint ?? "",
    awsAccessKeyId: s3.awsAccessKeyId,
    awsSecretAccessKey: s3.awsSecretAccessKey,
    prefix: s3.prefix ?? "",
    acl: s3.acl ?? "",
    storageClass: s3.storageClass ?? "",
    encryptionMethod: s3.encryptionMethod ?? "",
    disableMultiDel: s3.disableMultiDel ?? false,
    forceSigV2: s3.forceSigV2 ?? false,
  };
};

const getInitialValues = (target: PublicationTarget) => ({
  displayName: target.displayName ?? "",
  ...getS3InitialValues(target.s3),
});

const EditTargetForm: FC<EditTargetFormProps> = ({ target }) => {
  const debug = useDebug();
  const { createPageParamsSetter } = usePageParams();
  const closeForm = createPageParamsSetter({ sidePath: [], name: "" });
  const { notify } = useNotify();
  const { editPublicationTargetQuery } = useEditPublicationTarget();
  const { mutateAsync: editTarget } = editPublicationTargetQuery;

  const handleSubmit = async (values: ReturnType<typeof getInitialValues>) => {
    try {
      await editTarget({
        name: target.name,
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
      closeForm();

      notify.success({
        title: "Publication target edited",
        message: `You have successfully edited ${values.displayName}`,
      });
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
        error={getFormikError(formik, "displayName")}
        {...formik.getFieldProps("displayName")}
      />
      <ReadOnlyField
        label="Region"
        required
        tooltipMessage="The region cannot be changed after the target has been created. To use a different region, create a new publication target."
        {...formik.getFieldProps("region")}
      />
      <ReadOnlyField
        label="Bucket name"
        required
        tooltipMessage="The bucket name cannot be changed after the target has been created. To use a different bucket, create a new publication target."
        {...formik.getFieldProps("bucket")}
      />
      <ReadOnlyField
        label="Endpoint"
        tooltipMessage="The endpoint cannot be changed after the target has been created. To use a different endpoint, create a new publication target."
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
      <ReadOnlyField
        label="Prefix"
        tooltipMessage="The prefix cannot be changed after the target has been created. To use a different prefix, create a new publication target."
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
        submitButtonText="Save changes"
        onCancel={closeForm}
      />
    </Form>
  );
};

export default EditTargetForm;
