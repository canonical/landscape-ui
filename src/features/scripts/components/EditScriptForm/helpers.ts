import * as Yup from "yup";
import type { Script } from "../../types";

export const getValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required("This field is required"),
    code: Yup.string().required("This field is required"),
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

export const getInitialValues = (script: Script) => {
  return {
    title: script.title,
    code: script.code,
    time_limit: script.time_limit,
    username: script.username,
    attachments: {
      first: null,
      second: null,
      third: null,
      fourth: null,
      fifth: null,
    },
    attachmentsToRemove: [],
  };
};

export const removeFileExtension = (filename: string): string => {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
};
