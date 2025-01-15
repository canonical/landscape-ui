import { TagsAddFormValues } from "./types";
import * as Yup from "yup";

export const INITIAL_TAGS_ADD_FORM_VALUES: TagsAddFormValues = {
  tags: [],
};

export const TAGS_ADD_FORM_VALIDATION_SCHEMA = Yup.object({
  tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
});
