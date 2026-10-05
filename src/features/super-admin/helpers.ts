import { ROUTES } from "@/libs/routes";
import type { SupportSessionNavItem } from "@/templates/support-session";
import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";
import { SUPPORT_PROFILE_PAGES } from "./constants";

/** The server's message for a failed request, or the error's own. */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiError>(error) && error.response?.data.message) {
    return error.response.data.message;
  }

  return error instanceof Error ? error.message : "Unknown error";
};

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

/** The support session's navigation for the account named `name`. */
export const getSupportSessionNavigation = (
  name: string,
): SupportSessionNavItem[] => [
  {
    label: "Events log",
    icon: "status",
    path: ROUTES.superAdmin.sessionEventsLog(name),
  },
  {
    label: "Profiles",
    icon: "cluster",
    items: SUPPORT_PROFILE_PAGES.map(({ slug, label }) => ({
      label,
      path: ROUTES.superAdmin.sessionProfile(name, slug),
    })),
  },
  // A placeholder: org settings land with LNDENG-5321.
  { label: "Org. settings", icon: "settings" },
];
