import type { InstanceWithoutRelation } from "@/types/Instance";
import type { FormikContextType } from "formik";
import type { FormProps } from "./types";

export const getAddedTags = (
  formik: FormikContextType<FormProps>,
  instance: InstanceWithoutRelation,
) => formik.values.tags.filter((tag) => !instance.tags.includes(tag));
