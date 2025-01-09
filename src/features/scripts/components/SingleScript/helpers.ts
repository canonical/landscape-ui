import * as Yup from "yup";
import { ComponentProps } from "react";
import SingleScript from "./SingleScript";
import { Script, ScriptFormValues } from "../../types";
import { Buffer } from "buffer";
import { CreateScriptAttachmentParams } from "../../hooks/useScripts";

export const getValidationSchema = (
  action: ComponentProps<typeof SingleScript>["action"],
) => {
  return Yup.object().shape({
    title: Yup.string().required("This field is required"),
    time_limit: Yup.number().required("This field is required"),
    code: Yup.string().test({
      name: "required",
      message: "This field is required",
      test: (value) => "copy" === action || "edit" === action || !!value,
    }),
    username: Yup.string(),
    access_group: Yup.string(),
    attachments: Yup.object().shape({
      first: Yup.mixed().nullable(),
      second: Yup.mixed().nullable(),
      third: Yup.mixed().nullable(),
      fourth: Yup.mixed().nullable(),
      fifth: Yup.mixed().nullable(),
    }),
    attachmentsToRemove: Yup.array().of(Yup.string()),
  });
};

const getEncodedCode = (code: string) => {
  const escapedCode = JSON.parse(JSON.stringify(code).replace(/\\r/g, ""));

  return Buffer.from(escapedCode).toString("base64");
};

export const getCreateScriptParams = (values: ScriptFormValues) => {
  return {
    access_group: values.access_group,
    code: getEncodedCode(values.code),
    time_limit: values.time_limit,
    title: values.title,
    username: values.username,
  };
};

export const getCopyScriptParams = ({
  props,
  values,
}: {
  props: { action: "copy"; script: Script };
  values: ScriptFormValues;
}) => {
  return {
    access_group: values.access_group,
    destination_title: values.title,
    script_id: props.script.id,
  };
};

export const getEditScriptParams = ({
  props,
  values,
}: {
  props: { action: "edit"; script: Script };
  values: ScriptFormValues;
}) => {
  return {
    code: getEncodedCode(values.code),
    script_id: props.script.id,
    time_limit: values.time_limit,
    title: values.title,
    username: values.username,
  };
};

interface GetCreateAttachmentsPromisesParams {
  attachments: File[];
  createScriptAttachment: (
    params: CreateScriptAttachmentParams,
  ) => Promise<unknown>;
  script_id: number;
}

export const getCreateAttachmentsPromises = async ({
  attachments,
  createScriptAttachment,
  script_id,
}: GetCreateAttachmentsPromisesParams) => {
  const bufferPromises: Promise<ArrayBuffer>[] = [];
  const fileNames: string[] = [];

  for (const attachment of attachments) {
    bufferPromises.push(attachment.arrayBuffer());
    fileNames.push(attachment.name);
  }

  const buffers = await Promise.all(bufferPromises);

  return buffers.map((buffer, index) =>
    createScriptAttachment({
      file: `${fileNames[index]}$$${Buffer.from(buffer).toString("base64")}`,
      script_id,
    }),
  );
};
