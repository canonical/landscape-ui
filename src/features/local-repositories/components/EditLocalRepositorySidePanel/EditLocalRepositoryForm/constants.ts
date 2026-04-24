import * as Yup from "yup";

export interface EditLocalRepositoryFormValues {
  displayName?: string;
  description?: string;
}

export const VALIDATION_SCHEMA = Yup.object().shape({
  displayName: Yup.string(),
  description: Yup.string(),
});
