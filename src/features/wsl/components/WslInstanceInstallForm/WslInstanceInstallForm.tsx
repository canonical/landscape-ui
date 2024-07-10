import { useFormik } from "formik";
import { FC } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { Form, Input, Select } from "@canonical/react-components";
import FileInput from "@/components/form/FileInput";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { useWsl } from "../../hooks";
import { FORM_FIELDS, MAX_FILE_SIZE_MB, RESERVED_PATTERNS } from "./constants";
import { fileToBase64 } from "./helpers";

interface FormProps {
  instanceType: string;
  cloudInit: File | null;
  instanceName: string;
  rootfs: string;
}

const WslInstanceInstallForm: FC = () => {
  const { instanceId } = useParams();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const { createChildInstanceQuery, getWslInstanceNamesQuery } = useWsl();
  const { openActivityDetails } = useActivities();

  const {
    data: getWslInstanceNamesQueryResult,
    isLoading: isLoadingWslInstanceNames,
  } = getWslInstanceNamesQuery();

  const { mutateAsync: createChildInstance } = createChildInstanceQuery;

  const formik = useFormik<FormProps>({
    initialValues: {
      instanceType: "Ubuntu",
      cloudInit: null,
      instanceName: "",
      rootfs: "",
    },
    validationSchema: Yup.object({
      instanceType: Yup.string().required("This field is required"),
      cloudInit: Yup.mixed<File>()
        .nullable()
        .test("file-size", "File size must be less than 1MB", (value) => {
          if (!value) {
            return true;
          }

          if (value.size === undefined) {
            return false;
          }

          return value.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        }),
      instanceName: Yup.string().when("instanceType", {
        is: "custom",
        then: (schema) =>
          schema
            .required("This field is required")
            .test(
              "not-match-reserved-patterns",
              "Instance name cannot match 'ubuntu', 'ubuntu-preview', or 'ubuntu-<dd>.<dd>'",
              (value) =>
                !RESERVED_PATTERNS.some((pattern: RegExp) =>
                  pattern.test(value.toLowerCase()),
                ),
            ),
      }),
      rootfs: Yup.string()
        .url()
        .when("instanceType", {
          is: "custom",
          then: (schema) => schema.required("This field is required"),
        }),
    }),
    onSubmit: async (values) => {
      try {
        const cloudInitBase64 = await fileToBase64(values.cloudInit);

        const strippedCloudInit = cloudInitBase64
          ? cloudInitBase64.split(",")[1]
          : undefined;

        const { data: activity } = await createChildInstance({
          parent_id: parseInt(instanceId ?? ""),
          computer_name:
            values.instanceType === "custom"
              ? values.instanceName
              : values.instanceType,
          rootfs_url:
            values.instanceType === "custom" ? values.rootfs : undefined,
          cloud_init: strippedCloudInit,
        });

        closeSidePanel();

        notify.success({
          message: "You queued a new WSL instance to be installed",
          actions: [
            {
              label: "View details",
              onClick: () => openActivityDetails(activity),
            },
          ],
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const instanceOptions =
    (getWslInstanceNamesQueryResult?.data ?? []).map(({ label, name }) => ({
      label,
      value: name,
    })) || [];

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("cloudInit", files[0]);
  };

  const handleRemoveFile = async () => {
    await formik.setFieldValue("cloudInit", null);
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {FORM_FIELDS.instanceType.type === "select" && (
        <Select
          label={FORM_FIELDS.instanceType.label}
          required
          disabled={isLoadingWslInstanceNames}
          options={[...instanceOptions, ...FORM_FIELDS.instanceType.options]}
          {...formik.getFieldProps("instanceType")}
          error={
            formik.touched.instanceType && formik.errors.instanceType
              ? formik.errors.instanceType
              : undefined
          }
        />
      )}

      {formik.values.instanceType === "custom" && (
        <>
          <Input
            label={FORM_FIELDS.instanceName.label}
            type={FORM_FIELDS.instanceName.type}
            required
            {...formik.getFieldProps("instanceName")}
            error={
              formik.touched.instanceName && formik.errors.instanceName
                ? formik.errors.instanceName
                : undefined
            }
          />
          <Input
            label={FORM_FIELDS.rootfs.label}
            type={FORM_FIELDS.rootfs.type}
            required
            {...formik.getFieldProps("rootfs")}
            error={
              formik.touched.rootfs && formik.errors.rootfs
                ? formik.errors.rootfs
                : undefined
            }
          />
        </>
      )}

      <FileInput
        label={FORM_FIELDS.cloudInit.label}
        accept=".yaml"
        {...formik.getFieldProps("cloudInit")}
        onFileRemove={handleRemoveFile}
        onFileUpload={handleFileUpload}
        help="You can use a cloud-init configuration YAML file under 1MB to register new WSL instances. Cloud-init streamlines the setup by automating installation and configuration tasks."
        error={
          formik.touched.cloudInit && formik.errors.cloudInit
            ? formik.errors.cloudInit
            : undefined
        }
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Install"
        submitButtonAriaLabel="Install new WSL instance"
      />
    </Form>
  );
};

export default WslInstanceInstallForm;
