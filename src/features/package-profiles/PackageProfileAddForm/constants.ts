import { AddFormProps } from "@/features/package-profiles/types";
import * as Yup from "yup";

export const INITIAL_VALUES: AddFormProps = {
  access_group: "",
  all_computers: false,
  constraints: [],
  constraintsType: "",
  csvFile: null,
  description: "",
  instanceId: 0,
  isCsvFileParsed: false,
  material: "",
  step: 1,
  tags: [],
  title: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  all_computers: Yup.boolean(),
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
  constraintsType: Yup.string().required("This field is required."),
  csvFile: Yup.mixed<File>()
    .nullable()
    .test({
      name: "mime-type",
      message: "Invalid file type.",
      test: (value) => !value || value.type === "text/csv",
    })
    .when("constraintsType", {
      is: "material",
      then: (schema) => schema.required("This field is required."),
    }),
  description: Yup.string().required("This field is required."),
  instanceId: Yup.number().when("constraintsType", {
    is: "instance",
    then: (schema) => schema.min(1, "This field is required."),
  }),
  isCsvFileParsed: Yup.boolean(),
  material: Yup.string().when("constraintsType", {
    is: "material",
    then: (schema) => schema.required("The file cannot be empty."),
  }),
  step: Yup.number(),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string().required("This field is required."),
});

export const CTA_LABELS = {
  add: "Add",
  create: "Create",
};
