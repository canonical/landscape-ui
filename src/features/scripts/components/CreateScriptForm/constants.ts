import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import type { ScriptFormValues } from "../../types";

export const SCRIPT_FORM_INITIAL_VALUES: ScriptFormValues = {
  title: "",
  code: "",
  access_group: DEFAULT_ACCESS_GROUP_NAME,
  attachments: {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  },
  attachmentsToRemove: [],
};
