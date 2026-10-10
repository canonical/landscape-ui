import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";

interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
}

const isValidationErrorDetail = (
  value: unknown,
): value is ValidationErrorDetail =>
  typeof value === "object" &&
  value !== null &&
  "loc" in value &&
  Array.isArray(value.loc) &&
  "msg" in value &&
  typeof value.msg === "string";

/**
 * The first message of each of `fieldNames` named in a pydantic validation
 * rejection (`detail[].loc`); empty for any other error.
 */
export const getValidationErrors = <F extends string>(
  error: unknown,
  fieldNames: readonly F[],
): Partial<Record<F, string>> => {
  const fieldErrors: Partial<Record<F, string>> = {};

  if (
    !isAxiosError<ApiError & { detail?: unknown }>(error) ||
    !Array.isArray(error.response?.data.detail)
  ) {
    return fieldErrors;
  }

  for (const item of error.response.data.detail) {
    if (!isValidationErrorDetail(item)) {
      continue;
    }

    const fieldName = fieldNames.find((name) => item.loc.includes(name));

    if (fieldName) {
      fieldErrors[fieldName] ??= item.msg;
    }
  }

  return fieldErrors;
};
