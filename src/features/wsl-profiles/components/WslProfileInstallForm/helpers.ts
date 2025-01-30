import * as Yup from "yup";
import { MAX_FILE_SIZE_MB, RESERVED_PATTERNS } from "../constants";
import type { ComponentProps } from "react";
import type WslProfileInstallForm from "./WslProfileInstallForm";

export const getValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required("This field is required"),
    access_group: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
    instanceType: Yup.string().required("This field is required"),
    rootfsImage: Yup.string().when("instanceType", {
      is: "custom",
      then: (schema) => schema.required("This field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    customImageName: Yup.string().when("instanceType", {
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
      otherwise: (schema) => schema.notRequired(),
    }),
    cloudInitType: Yup.string(),
    cloudInit: Yup.mixed<File>()
      .nullable()
      .when("cloudInitType", {
        is: (value: string) => value === "file" || value === "text",
        then: (schema) =>
          schema
            .required("This field is required")
            .test(
              "file-size",
              "File size must be less than 1MB",
              (value: File | string) => {
                if (typeof value === "string") {
                  value = convertStringtoFile(value);
                }

                if (!value) {
                  return true;
                }

                if (value.size === undefined) {
                  return false;
                }
                return value.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
              },
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
    all_computers: Yup.boolean(),
    tags: Yup.array().of(Yup.string()),
  });
};

export const getInitialValues = (
  props: ComponentProps<typeof WslProfileInstallForm>,
) => {
  return props.action === "add"
    ? {
        title: "",
        access_group: "",
        description: "",
        instanceType: "",
        customImageName: "",
        rootfsImage: "",
        cloudInitType: "",
        cloudInit: null,
        all_computers: false,
        tags: [],
      }
    : {
        title: `${props.profile.title} (copy)`,
        access_group: props.profile.access_group,
        all_computers: props.profile.all_computers,
        cloudInit: null,
        cloudInitType: "",
        description: props.profile.description,
        tags: props.profile.tags,
        customImageName: props.profile.image_source
          ? props.profile.image_name
          : "",
        instanceType: props.profile.image_source
          ? "custom"
          : props.profile.image_name,
        rootfsImage: props.profile.image_source || "",
      };
};

const convertStringtoFile = (inputString: string) => {
  const blob = new Blob([inputString], { type: "application/x-yaml" });
  return new File([blob], "myFile.yaml", { type: "application/x-yaml" });
};

const fileToBase64 = (file: File | null): Promise<string> | undefined => {
  if (!file) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getCloudInitFile = async (
  cloudInit: File | string | null,
): Promise<string | undefined> => {
  if (cloudInit === null) {
    return undefined;
  }

  let cloudInitFile: File;

  if (typeof cloudInit === "string") {
    cloudInitFile = convertStringtoFile(cloudInit);
  } else {
    cloudInitFile = cloudInit;
  }

  const cloudInitBase64 = await fileToBase64(cloudInitFile);
  return cloudInitBase64 ? cloudInitBase64.split(",")[1] : undefined;
};
