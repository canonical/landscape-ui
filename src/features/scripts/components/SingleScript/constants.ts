import type { ScriptFormValues } from "../../types";

export const CTA_LABELS = {
  add: "Add script",
  edit: "Submit new version",
};

export const SCRIPT_FORM_INITIAL_VALUES: ScriptFormValues = {
  title: "",
  code: "",
  attachments: {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  },
  attachmentsToRemove: [],
};
