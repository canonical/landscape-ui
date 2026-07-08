import type { SelectOption } from "@/types/SelectOption";
import * as Yup from "yup";
import { REQUIRED_FIELD_MESSAGE, VALIDATION_SCHEMA_NEW } from "../../constants";

export const SOURCE_TYPE_MIRROR = "Mirror";
export const SOURCE_TYPE_LOCAL_REPOSITORY = "Local repository";

export const SOURCE_TYPE_OPTIONS: SelectOption[] = [
  { label: SOURCE_TYPE_MIRROR, value: SOURCE_TYPE_MIRROR },
  {
    label: SOURCE_TYPE_LOCAL_REPOSITORY,
    value: SOURCE_TYPE_LOCAL_REPOSITORY,
  },
];

export const VALIDATION_SCHEMA = VALIDATION_SCHEMA_NEW.shape({
  sourceType: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  source: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  architectures: Yup.array()
    .of(Yup.string())
    .when("sourceType", {
      is: SOURCE_TYPE_LOCAL_REPOSITORY,
      then: (schema) => schema,
      otherwise: (schema) => schema.min(1, REQUIRED_FIELD_MESSAGE),
    }),
});
