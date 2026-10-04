import * as Yup from "yup";
import { WSL_LIMIT_FIELDS } from "../../constants";

export const WSL_LIMIT_MIN = 0;

const REQUIRED_MESSAGE = "This field is required.";

// The server only asserts the integer type (`WSLFeatureLimitsPostBody`); the
// lower bound keeps a limit from going negative.
const LIMIT_SCHEMA = Yup.number()
  .typeError(REQUIRED_MESSAGE)
  .required(REQUIRED_MESSAGE)
  .integer("Enter a whole number.")
  .min(WSL_LIMIT_MIN, `Enter ${WSL_LIMIT_MIN} or more.`);

export const VALIDATION_SCHEMA = Yup.object().shape(
  Object.fromEntries(WSL_LIMIT_FIELDS.map(({ name }) => [name, LIMIT_SCHEMA])),
);
