import type { FormikErrors } from "formik";
import { WSL_LIMIT_FIELDS } from "../../constants";
import { getValidationErrors } from "../../helpers";
import type { WslFeatureLimits } from "../../types";
import type { FormProps, WslLimitChange } from "./types";

const FIELD_NAMES = WSL_LIMIT_FIELDS.map(({ name }) => name);

/** The limits as the server stores them; `null` while any field is empty. */
export const getLimits = (values: FormProps): WslFeatureLimits | null => {
  const limits: Partial<WslFeatureLimits> = {};

  for (const name of FIELD_NAMES) {
    const value = values[name];

    if (value === "") {
      return null;
    }

    limits[name] = value;
  }

  return limits as WslFeatureLimits;
};

/** The limits that differ from `wslLimits`, as "from" and "to", for the confirmation. */
export const describeChanges = (
  limits: WslFeatureLimits,
  wslLimits: WslFeatureLimits,
): WslLimitChange[] =>
  WSL_LIMIT_FIELDS.filter(({ name }) => limits[name] !== wslLimits[name]).map(
    ({ name, label }) => ({ label, from: wslLimits[name], to: limits[name] }),
  );

/** The fields a rejected POST names. */
export const getFieldErrors = (error: unknown): FormikErrors<FormProps> =>
  getValidationErrors(error, FIELD_NAMES);
