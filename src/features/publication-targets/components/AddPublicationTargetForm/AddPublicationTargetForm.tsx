import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import useCreatePublicationTarget from "../../api/useCreatePublicationTarget";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import { INITIAL_VALUES } from "./constants";
import type {
  AddPublicationTargetFormValues,
  FilesystemFormValues,
  S3FormValues,
  SwiftFormValues,
  TargetType,
} from "./constants";
import useNotify from "@/hooks/useNotify";
import { FilesystemFields, S3Fields, SwiftFields } from "../TargetTypeFields";
import type { FilesystemTargetLinkMethod } from "@canonical/landscape-openapi";

const TARGET_TYPE_OPTIONS = [
  { value: "s3", label: "S3" },
  { value: "swift", label: "Swift" },
  { value: "filesystem", label: "Filesystem" },
];

const VALIDATION_SCHEMA = Yup.object().shape({
  displayName: Yup.string().required("This field is required"),
  targetType: Yup.string().oneOf(["s3", "swift", "filesystem"]).required(),
  s3: Yup.object().when("targetType", {
    is: "s3",
    then: () =>
      Yup.object({
        region: Yup.string().required("This field is required"),
        bucket: Yup.string().required("This field is required"),
        awsAccessKeyId: Yup.string().required("This field is required"),
        awsSecretAccessKey: Yup.string().required("This field is required"),
      }),
  }),
  swift: Yup.object().when("targetType", {
    is: "swift",
    then: () =>
      Yup.object({
        container: Yup.string().required("This field is required"),
        username: Yup.string().required("This field is required"),
        password: Yup.string().required("This field is required"),
        authUrl: Yup.string().required("This field is required"),
      }),
  }),
  filesystem: Yup.object().when("targetType", {
    is: "filesystem",
    then: () =>
      Yup.object({
        path: Yup.string()
          .required("This field is required")
          .matches(/^\//, "Path must start with /"),
      }),
  }),
});

const buildS3Payload = (values: S3FormValues) => ({
  region: values.region,
  bucket: values.bucket,
  awsAccessKeyId: values.awsAccessKeyId,
  awsSecretAccessKey: values.awsSecretAccessKey,
  ...(values.endpoint && { endpoint: values.endpoint }),
  ...(values.prefix && { prefix: values.prefix }),
  ...(values.acl && { acl: values.acl }),
  ...(values.storageClass && { storageClass: values.storageClass }),
  ...(values.encryptionMethod && { encryptionMethod: values.encryptionMethod }),
  disableMultiDel: values.disableMultiDel,
  forceSigV2: values.forceSigV2,
});

const buildSwiftPayload = (values: SwiftFormValues) => ({
  container: values.container,
  username: values.username,
  password: values.password,
  authUrl: values.authUrl,
  ...(values.prefix && { prefix: values.prefix }),
  ...(values.tenant && { tenant: values.tenant }),
  ...(values.tenantId && { tenantId: values.tenantId }),
  ...(values.domain && { domain: values.domain }),
  ...(values.domainId && { domainId: values.domainId }),
  ...(values.tenantDomain && { tenantDomain: values.tenantDomain }),
  ...(values.tenantDomainId && { tenantDomainId: values.tenantDomainId }),
});

const buildFilesystemPayload = (values: FilesystemFormValues) => ({
  path: values.path,
  ...(values.linkMethod && {
    linkMethod: values.linkMethod as FilesystemTargetLinkMethod,
  }),
});

const AddPublicationTargetForm: FC = () => {
  const debug = useDebug();
  const { createPageParamsSetter } = usePageParams();
  const closeForm = createPageParamsSetter({ sidePath: [], name: "" });
  const { notify } = useNotify();
  const { createPublicationTargetQuery } = useCreatePublicationTarget();

  const { mutateAsync } = createPublicationTargetQuery;

  const formik = useFormik<AddPublicationTargetFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        if (values.targetType === "s3") {
          await mutateAsync({
            displayName: values.displayName,
            s3: buildS3Payload(values.s3),
          });
        } else if (values.targetType === "swift") {
          await mutateAsync({
            displayName: values.displayName,
            swift: buildSwiftPayload(values.swift),
          });
        } else {
          await mutateAsync({
            displayName: values.displayName,
            filesystem: buildFilesystemPayload(values.filesystem),
          });
        }

        closeForm();

        notify.success({
          title: "Publication target created",
          message: `You have successfully added ${values.displayName}`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setValues({
      ...INITIAL_VALUES,
      displayName: formik.values.displayName,
      targetType: e.target.value as TargetType,
    });
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
        required
        error={getFormikError(formik, "displayName")}
        {...formik.getFieldProps("displayName")}
      />
      <Select
        label="Type"
        required
        options={TARGET_TYPE_OPTIONS}
        value={formik.values.targetType}
        onChange={handleTypeChange}
        error={getFormikError(formik, "targetType")}
      />
      {formik.values.targetType === "s3" && <S3Fields formik={formik} />}
      {formik.values.targetType === "swift" && <SwiftFields formik={formik} />}
      {formik.values.targetType === "filesystem" && (
        <FilesystemFields formik={formik} />
      )}
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add publication target"
        onCancel={closeForm}
      />
    </Form>
  );
};

export default AddPublicationTargetForm;
