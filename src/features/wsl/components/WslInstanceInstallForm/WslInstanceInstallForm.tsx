import FileInput from "@/components/form/FileInput";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useCreateWslInstance, useGetWslInstanceTypes } from "../../api";
import { MAX_FILE_SIZE_MB, RESERVED_PATTERNS } from "./constants";
import { fileToBase64 } from "./helpers";

interface FormProps {
  instanceType: string;
  cloudInit: File | null;
  instanceName: string;
  rootfs: string;
}

const WslInstanceInstallForm: FC = () => {
  const { instanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const { openActivityDetails } = useActivities();

  const { isGettingWslInstanceTypes, wslInstanceTypes } =
    useGetWslInstanceTypes();

  const { createWslInstance } = useCreateWslInstance();

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

        const { data: activity } = await createWslInstance({
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
          title: `You have successfully marked ${values.instanceName} to be installed.`,
          message: "An activity has been queued to install it.",
          actions: [
            {
              label: "View details",
              onClick: () => {
                openActivityDetails(activity);
              },
            },
          ],
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const instanceQueryResultOptions =
    wslInstanceTypes.map(({ label, name }) => ({
      label,
      value: name,
    })) || [];

  const instanceOptions = [
    ...instanceQueryResultOptions,
    { label: "Custom", value: "custom" },
  ];

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("cloudInit", files[0]);
  };

  const handleRemoveFile = async () => {
    await formik.setFieldValue("cloudInit", null);
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Instance type"
        required
        disabled={isGettingWslInstanceTypes}
        options={instanceOptions}
        {...formik.getFieldProps("instanceType")}
        error={
          formik.touched.instanceType && formik.errors.instanceType
            ? formik.errors.instanceType
            : undefined
        }
      />

      {formik.values.instanceType === "custom" && (
        <>
          <Input
            label="Instance name"
            type="text"
            required
            {...formik.getFieldProps("instanceName")}
            error={
              formik.touched.instanceName && formik.errors.instanceName
                ? formik.errors.instanceName
                : undefined
            }
          />
          <Input
            label="Rootfs URL"
            type="text"
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
        label="Cloud-init"
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
        submitButtonText="Create"
        submitButtonAriaLabel="Create new WSL instance"
      />
    </Form>
  );
};

export default WslInstanceInstallForm;
