import { DuplicateFormProps } from "@/features/package-profiles/types";
import * as Yup from "yup";

export const INITIAL_VALUES: DuplicateFormProps = {
  access_group: "",
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
