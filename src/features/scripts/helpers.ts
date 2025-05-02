import { Buffer } from "buffer";
import type { ScriptFormValues } from "./types";
import type { CreateScriptAttachmentParams } from "./api";

const getEncodedCode = (code: string) => {
  const escapedCode = JSON.parse(JSON.stringify(code).replace(/\\r/g, ""));

  return Buffer.from(escapedCode).toString("base64");
};

export const getCreateScriptParams = (values: ScriptFormValues) => {
  return {
    code: getEncodedCode(values.code),
    title: values.title.trim(),
    script_type: "V2",
    access_group: values.access_group,
  };
};

export const getEditScriptParams = ({
  scriptId,
  values,
}: {
  scriptId: number;
  values: ScriptFormValues;
}) => {
  return {
    code: getEncodedCode(values.code),
    script_id: scriptId,
    title: values.title.trim(),
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

  return buffers.map(async (buffer, index) =>
    createScriptAttachment({
      file: `${fileNames[index]}$$${Buffer.from(buffer).toString("base64")}`,
      script_id,
    }),
  );
};

export const removeFileExtension = (filename: string): string => {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
};

export const formatTitleCase = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
