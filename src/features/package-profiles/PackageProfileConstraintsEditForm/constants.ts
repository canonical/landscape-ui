import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
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
});
