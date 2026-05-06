import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import useEditPublicationTarget from "../../api/useEditPublicationTarget";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import type {
  FilesystemTargetLinkMethod,
  PublicationTarget,
} from "@canonical/landscape-openapi";
import useNotify from "@/hooks/useNotify";
import {
  EMPTY_VALUES,
  LINK_METHOD_OPTIONS,
  TARGET_TYPE_LABELS,
  VALIDATION_SCHEMA,
} from "../../constants";
import type { EditTargetFormValues } from "../../constants";

export { TARGET_TYPE_LABELS } from "../../constants";

interface EditTargetFormProps {
  readonly target: PublicationTarget;
}

export const getTargetType = (
  target: PublicationTarget,
): "s3" | "swift" | "filesystem" => {
  if (target.s3) return "s3";
  if (target.swift) return "swift";
  if (target.filesystem) return "filesystem";
  throw new Error("Unsupported publication target type");
};

const getS3InitialValues = (
  target: PublicationTarget,
  base: EditTargetFormValues,
): EditTargetFormValues => ({
  ...base,
  region: target.s3?.region ?? "",
  bucket: target.s3?.bucket ?? "",
  endpoint: target.s3?.endpoint ?? "",
  s3Prefix: target.s3?.prefix ?? "",
  acl: target.s3?.acl ?? "",
  storageClass: target.s3?.storageClass ?? "",
  encryptionMethod: target.s3?.encryptionMethod ?? "",
  disableMultiDel: target.s3?.disableMultiDel ?? false,
  forceSigV2: target.s3?.forceSigV2 ?? false,
});

const getSwiftInitialValues = (
  target: PublicationTarget,
  base: EditTargetFormValues,
): EditTargetFormValues => ({
  ...base,
  container: target.swift?.container ?? "",
  swiftPrefix: target.swift?.prefix ?? "",
  authUrl: target.swift?.authUrl ?? "",
  tenant: target.swift?.tenant ?? "",
  tenantId: target.swift?.tenantId ?? "",
  domain: target.swift?.domain ?? "",
  domainId: target.swift?.domainId ?? "",
  tenantDomain: target.swift?.tenantDomain ?? "",
  tenantDomainId: target.swift?.tenantDomainId ?? "",
});

const getFilesystemInitialValues = (
  target: PublicationTarget,
  base: EditTargetFormValues,
): EditTargetFormValues => ({
  ...base,
  path: target.filesystem?.path ?? "",
  linkMethod: target.filesystem?.linkMethod ?? EMPTY_VALUES.linkMethod,
});

const getInitialValues = (target: PublicationTarget): EditTargetFormValues => {
  const base = { ...EMPTY_VALUES, displayName: target.displayName ?? "" };
  if (target.s3) return getS3InitialValues(target, base);
  if (target.swift) return getSwiftInitialValues(target, base);
  return getFilesystemInitialValues(target, base);
};

const buildS3Payload = (values: EditTargetFormValues) => ({
  region: values.region,
  bucket: values.bucket,
  ...(values.awsAccessKeyId && { awsAccessKeyId: values.awsAccessKeyId }),
  ...(values.awsSecretAccessKey && {
    awsSecretAccessKey: values.awsSecretAccessKey,
  }),
  ...(values.endpoint && { endpoint: values.endpoint }),
  ...(values.s3Prefix && { prefix: values.s3Prefix }),
  ...(values.acl && { acl: values.acl }),
  ...(values.storageClass && { storageClass: values.storageClass }),
  ...(values.encryptionMethod && {
    encryptionMethod: values.encryptionMethod,
  }),
  disableMultiDel: values.disableMultiDel,
  forceSigV2: values.forceSigV2,
});

const buildSwiftPayload = (values: EditTargetFormValues) => ({
  container: values.container,
  authUrl: values.authUrl,
  ...(values.swiftUsername && { username: values.swiftUsername }),
  ...(values.swiftPassword && { password: values.swiftPassword }),
  ...(values.swiftPrefix && { prefix: values.swiftPrefix }),
  ...(values.tenant && { tenant: values.tenant }),
  ...(values.tenantId && { tenantId: values.tenantId }),
  ...(values.domain && { domain: values.domain }),
  ...(values.domainId && { domainId: values.domainId }),
  ...(values.tenantDomain && { tenantDomain: values.tenantDomain }),
  ...(values.tenantDomainId && { tenantDomainId: values.tenantDomainId }),
});

const buildFilesystemPayload = (values: EditTargetFormValues) => ({
  path: values.path,
  ...(values.linkMethod && {
    linkMethod: values.linkMethod as FilesystemTargetLinkMethod,
  }),
});

const EditTargetForm: FC<EditTargetFormProps> = ({ target }) => {
  const debug = useDebug();
  const { closeSidePanel, popSidePathUntilClear } = usePageParams();
  const { notify } = useNotify();
  const { editPublicationTargetQuery } = useEditPublicationTarget();
  const { mutateAsync: editTarget } = editPublicationTargetQuery;

  const targetType = getTargetType(target);

  const formik = useFormik<EditTargetFormValues>({
    initialValues: getInitialValues(target),
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        if (targetType === "s3") {
          await editTarget({
            name: target.name,
            displayName: values.displayName,
            s3: buildS3Payload(values),
          });
        } else if (targetType === "swift") {
          await editTarget({
            name: target.name,
            displayName: values.displayName,
            swift: buildSwiftPayload(values),
          });
        } else {
          await editTarget({
            name: target.name,
            displayName: values.displayName,
            filesystem: buildFilesystemPayload(values),
          });
        }

        closeSidePanel();

        notify.success({
          title: "Publication target edited",
          message: `You have successfully edited ${values.displayName}`,
        });
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
      <ReadOnlyField
        label="Type"
        value={TARGET_TYPE_LABELS[targetType]}
        tooltipMessage="The type cannot be changed after the target has been created. To use a different type, create a new publication target."
      />

      {targetType === "s3" && (
        <>
          <ReadOnlyField
            label="Region"
            tooltipMessage="The region cannot be changed after the target has been created. To use a different region, create a new publication target."
            {...formik.getFieldProps("region")}
          />
          <ReadOnlyField
            label="Bucket name"
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
            help="Leave blank to keep current value"
            error={getFormikError(formik, "awsAccessKeyId")}
            {...formik.getFieldProps("awsAccessKeyId")}
          />
          <Input
            type="text"
            label="AWS secret access key"
            help="Leave blank to keep current value"
            error={getFormikError(formik, "awsSecretAccessKey")}
            {...formik.getFieldProps("awsSecretAccessKey")}
          />
          <ReadOnlyField
            label="Prefix"
            tooltipMessage="The prefix cannot be changed after the target has been created. To use a different prefix, create a new publication target."
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
        </>
      )}

      {targetType === "swift" && (
        <>
          <ReadOnlyField
            label="Container"
            tooltipMessage="The container cannot be changed after the target has been created. To use a different container, create a new publication target."
            {...formik.getFieldProps("container")}
          />
          <Input
            type="text"
            label="Username"
            help="Leave blank to keep current value"
            error={getFormikError(formik, "swiftUsername")}
            {...formik.getFieldProps("swiftUsername")}
          />
          <Input
            type="password"
            label="Password"
            help="Leave blank to keep current value"
            error={getFormikError(formik, "swiftPassword")}
            {...formik.getFieldProps("swiftPassword")}
          />
          <ReadOnlyField
            label="Auth URL"
            tooltipMessage="The auth URL cannot be changed after the target has been created. To use a different auth URL, create a new publication target."
            {...formik.getFieldProps("authUrl")}
          />
          <Input
            type="text"
            label="Prefix"
            error={getFormikError(formik, "swiftPrefix")}
            {...formik.getFieldProps("swiftPrefix")}
          />
          <Input
            type="text"
            label="Tenant"
            error={getFormikError(formik, "tenant")}
            {...formik.getFieldProps("tenant")}
          />
          <Input
            type="text"
            label="Tenant ID"
            error={getFormikError(formik, "tenantId")}
            {...formik.getFieldProps("tenantId")}
          />
          <Input
            type="text"
            label="Domain"
            error={getFormikError(formik, "domain")}
            {...formik.getFieldProps("domain")}
          />
          <Input
            type="text"
            label="Domain ID"
            error={getFormikError(formik, "domainId")}
            {...formik.getFieldProps("domainId")}
          />
          <Input
            type="text"
            label="Tenant domain"
            error={getFormikError(formik, "tenantDomain")}
            {...formik.getFieldProps("tenantDomain")}
          />
          <Input
            type="text"
            label="Tenant domain ID"
            error={getFormikError(formik, "tenantDomainId")}
            {...formik.getFieldProps("tenantDomainId")}
          />
        </>
      )}

      {targetType === "filesystem" && (
        <>
          <ReadOnlyField
            label="Path"
            tooltipMessage="The path cannot be changed after the target has been created. To use a different path, create a new publication target."
            {...formik.getFieldProps("path")}
          />
          <Select
            label="Link method"
            options={LINK_METHOD_OPTIONS}
            error={getFormikError(formik, "linkMethod")}
            {...formik.getFieldProps("linkMethod")}
          />
        </>
      )}

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default EditTargetForm;
