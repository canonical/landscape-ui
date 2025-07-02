import * as Yup from "yup";

export const getValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required("This field is required"),
    access_group: Yup.string().nullable(),
    code: Yup.string().test({
      name: "required",
      message: "This field is required",
      test: (value) => !!value,
    }),
    attachments: Yup.object().shape({
      first: Yup.mixed().nullable(),
      second: Yup.mixed().nullable(),
      third: Yup.mixed().nullable(),
      fourth: Yup.mixed().nullable(),
      fifth: Yup.mixed().nullable(),
    }),
    attachmentsToRemove: Yup.array().of(Yup.string()),
  });
};
