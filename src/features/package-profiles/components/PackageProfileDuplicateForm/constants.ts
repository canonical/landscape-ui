import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import * as Yup from "yup";
import type { DuplicateFormProps } from "../../types";

export const INITIAL_VALUES: DuplicateFormProps = {
  access_group: DEFAULT_ACCESS_GROUP_NAME,
  all_computers: false,
  description: "",
  tags: [],
  title: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  all_computers: Yup.boolean(),
  description: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string(),
});
