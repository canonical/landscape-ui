import * as Yup from "yup";
import type { RunInstanceScriptFormValues } from "../../types";

export const INITIAL_VALUES: RunInstanceScriptFormValues = {
  access_group: "",
  attachments: {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  },
  code: "",
  deliverImmediately: true,
  deliver_after: "",
  saveScript: true,
  script_id: 0,
  time_limit: 300,
  title: "",
  type: "new",
  username: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  attachments: Yup.object().shape({
    first: Yup.mixed().nullable(),
    second: Yup.mixed().nullable(),
    third: Yup.mixed().nullable(),
    fourth: Yup.mixed().nullable(),
    fifth: Yup.mixed().nullable(),
  }),
  code: Yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  deliverImmediately: Yup.boolean().required(),
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) => schema.required(),
  }),
  saveScript: Yup.boolean().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  script_id: Yup.number().when("type", {
    is: "existing",
    then: (schema) => schema.min(1, "Script is required"),
  }),
  time_limit: Yup.number().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  title: Yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  type: Yup.string<RunInstanceScriptFormValues["type"]>().required(),
  username: Yup.string().required(),
});

export const SCRIPT_TYPE_OPTIONS = [
  {
    label: "New script",
    value: "new",
  },
  {
    label: "Existing script",
    value: "existing",
  },
];
