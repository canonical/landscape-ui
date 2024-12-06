import { SelectOption } from "@/types/SelectOption";
import { EditUserFormValues } from "./types";
import { FormikErrors, FormikTouched } from "formik";

export const getAccountOptions = (options: SelectOption[], current: string) => {
  return current ? options : [{ label: "", value: "" }, ...options];
};

export const getFieldError = (
  formik: {
    touched: FormikTouched<EditUserFormValues>;
    errors: FormikErrors<EditUserFormValues>;
  },
  field: keyof EditUserFormValues,
) => {
  return (formik.touched[field] && formik.errors[field]) || undefined;
};
