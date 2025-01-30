import * as Yup from "yup";
import { EMPTY_CONSTRAINT } from "../../constants";
import type { AddFormProps } from "../../types";

export const INITIAL_VALUES: AddFormProps = {
  access_group: "",
  all_computers: false,
  constraints: [EMPTY_CONSTRAINT],
  constraintsType: "",
  csvFile: null,
  description: "",
  isCsvFileParsed: false,
  material: "",
  source_computer_id: 0,
  tags: [],
  title: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  all_computers: Yup.boolean(),
  constraints: Yup.array().when("constraintsType", {
    is: "manual",
    then: (schema) =>
      schema
        .of(
          Yup.object().shape({
            constraint: Yup.string().required("Required."),
            notAnyVersion: Yup.boolean(),
            package: Yup.string().required("Required."),
            rule: Yup.string().when("notAnyVersion", {
              is: true,
              then: (schema) => schema.required("Required."),
            }),
            version: Yup.string().when("notAnyVersion", {
              is: true,
              then: (schema) => schema.required("Required."),
            }),
          }),
        )
        .min(1, "Package profiles must have at least one package constraint."),
  }),
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
  isCsvFileParsed: Yup.boolean(),
  material: Yup.string().when("constraintsType", {
    is: "material",
    then: (schema) => schema.required("The file cannot be empty."),
  }),
  source_computer_id: Yup.number().when("constraintsType", {
    is: "instance",
    then: (schema) => schema.min(1, "This field is required."),
  }),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string().required("This field is required."),
});
