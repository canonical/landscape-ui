import { VALIDATION_SCHEMA_NEW, REQUIRED_FIELD_MESSAGE } from "@/features/publications";
import * as Yup from "yup";

export const VALIDATION_SCHEMA_NEW_MIRROR = VALIDATION_SCHEMA_NEW.shape({
  distribution: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  architectures: Yup.array().of(Yup.string()).min(1, REQUIRED_FIELD_MESSAGE),
});
