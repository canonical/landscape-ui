import { constraintsSchema } from "../../../../constants";
import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  constraints: constraintsSchema,
});
