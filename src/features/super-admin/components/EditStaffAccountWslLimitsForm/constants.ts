import * as Yup from "yup";
import { WSL_LIMIT_FIELDS } from "../../constants";

export const WSL_LIMIT_MIN = 0;
export const WSL_LIMIT_MAX = 100000;

const REQUIRED_MESSAGE = "This field is required.";

const LIMIT_SCHEMA = Yup.number()
  .typeError(REQUIRED_MESSAGE)
  .required(REQUIRED_MESSAGE)
  .integer("Enter a whole number.")
  .min(WSL_LIMIT_MIN, `Enter ${WSL_LIMIT_MIN} or more.`)
  .max(WSL_LIMIT_MAX, `Enter ${WSL_LIMIT_MAX.toLocaleString()} or less.`);

export const VALIDATION_SCHEMA = Yup.object().shape(
  Object.fromEntries(WSL_LIMIT_FIELDS.map(({ name }) => [name, LIMIT_SCHEMA])),
);
