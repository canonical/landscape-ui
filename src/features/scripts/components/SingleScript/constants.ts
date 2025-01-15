import { ScriptFormValues } from "../../types";

export const CTA_LABELS = {
  add: "Add script",
  copy: "Copy script",
  edit: "Save changes",
};

export const SCRIPT_FORM_INITIAL_VALUES: ScriptFormValues = {
  title: "",
  code: "",
  access_group: "",
  time_limit: 300,
  username: "",
  attachments: {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  },
  attachmentsToRemove: [],
};
