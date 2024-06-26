import * as Yup from "yup";
import { testLowercaseAlphaNumeric } from "@/utils/tests";

export const getValidationSchema = (action: "add" | "edit") => {
  return Yup.object().shape({
    access_group: Yup.string(),
    all_computers: Yup.boolean(),
    apt_sources: Yup.array().of(Yup.string()),
    description: Yup.string(),
    pockets: Yup.array().of(Yup.string()),
    tags: Yup.array().of(Yup.string()),
    title: Yup.string()
      .test({
        test: (value) => !value || testLowercaseAlphaNumeric.test(value),
        message: testLowercaseAlphaNumeric.message,
      })
      .test({
        message: "This field is required.",
        params: { action },
        test: (value) => action !== "add" || !!value,
      }),
  });
};
