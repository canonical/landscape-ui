import * as Yup from "yup";

export interface EditLocalRepositoryFormValues {
  displayName?: string;
  description?: string;
}

export const VALIDATION_SCHEMA = Yup.object().shape({
  displayName: Yup.string().required("This field is required."),
  description: Yup.string(),
});
