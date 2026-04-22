import * as Yup from "yup";

export interface AddLocalRepositoryFormValues {
  name: string;
  description: string;
  distribution: string;
  component: string;
}

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  description: Yup.string(),
  distribution: Yup.string().required("This field is required."),
  component: Yup.string().required("This field is required."),
});

export const INITIAL_VALUES = {
  name: "",
  description: "",
  distribution: "",
  component: "",
};
