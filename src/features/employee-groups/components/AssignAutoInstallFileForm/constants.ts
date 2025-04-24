import type { SelectOption } from "@/types/SelectOption";
import type { FormProps } from "./types";
import * as Yup from "yup";

export const AUTOINSTALL_FILES: SelectOption[] = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "Add new Autoinstall file",
    value: "new",
  },
  {
    label: "Assign existing Autoinstall file",
    value: "assign-existing",
  },
  {
    label: "Inherit default Autoinstall file",
    value: "inherit",
  },
];

export const INITIAL_VALUES: FormProps = {
  dropdownChoice: "",
  filename: "",
  contents: "",
  selectedAutoinstallFile: null,
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  dropdownChoice: Yup.string().required("This field is required"),
  filename: Yup.string().when("dropdownChoice", {
    is: "new",
    then: (schema) => schema.required("This field is required"),
  }),
  contents: Yup.string().when("dropdownChoice", {
    is: "new",
    then: (schema) => schema.required("This field is required"),
  }),
  selectedAutoinstallFile: Yup.object().when("dropdownChoice", {
    is: "assign-existing",
    then: (schema) => schema.required("This field is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});
