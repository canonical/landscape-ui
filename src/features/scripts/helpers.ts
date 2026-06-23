import type { ScriptFormValues } from "./types";
import type { CreateScriptAttachmentParams } from "./api";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";

const uint8ToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const CHUNK_SIZE = 0x8000; // 32KB chunks

  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    binary += String.fromCharCode(...Array.from(chunk));
  }

  return btoa(binary);
};

export const getEncodedCode = (code: string) => {
  const escapedCode = JSON.parse(JSON.stringify(code).replace(/\\r/g, ""));

  const bytes = new TextEncoder().encode(escapedCode);
  return uint8ToBase64(bytes);
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

  return buffers.map(async (buffer, index) => {
    const bytes = new Uint8Array(buffer);

    return createScriptAttachment({
      file: `${fileNames[index]}$$${uint8ToBase64(bytes)}`,
      script_id,
    });
  });
};

export const removeFileExtension = (filename: string): string => {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
};

export const formatTitleCase = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const getCode = ({
  interpreter,
  code,
}: {
  interpreter: string | undefined;
  code: string | undefined;
}) => {
  return `#!${interpreter}` + "\n" + code;
};

export const getAuthorInfo = ({
  author,
  date: dateString,
}: {
  author: string;
  date: string;
}) => {
  return `${date(dateString).format(DISPLAY_DATE_TIME_FORMAT)}, by ${author}`;
};
