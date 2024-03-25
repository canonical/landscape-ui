import { DuplicateFormProps } from "@/features/package-profiles/types";
import * as Yup from "yup";

export const INITIAL_VALUES: DuplicateFormProps = {
  all_computers: true,
  access_group: "",
  constraints: [],
  description: "",
  step: 1,
  tags: [],
  title: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  all_computers: Yup.boolean(),
  access_group: Yup.string(),
  constraints: Yup.array()
    .of(
      Yup.object().shape({
        constraint: Yup.string().required("Required."),
        notAnyVersion: Yup.boolean(),
        package: Yup.string().required("Required."),
        rule: Yup.string().when("notAnyVersion", {
          is: true,
          then: (schema) => schema.required("Required."),
        }),
        version: Yup.string().when("notAnyVersion", (values, schema) =>
          values[0] ? schema.required("Required.") : schema,
        ),
      }),
    )
    .min(1, "Package profiles must have at least one package constraint."),
  description: Yup.string().required("This field is required."),
  step: Yup.number(),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string().required("This field is required."),
});
