import { ROUTES } from "@/libs/routes";
import type { SupportSessionNavItem } from "@/templates/support-session";
import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";
import {
  STAFF_PEOPLE_TYPE_OPTIONS,
  SUPPORT_PROFILE_PAGES,
  SUPPORT_SETTINGS_PAGES,
} from "./constants";
import type { StaffPeopleResult, StaffPeopleResultType } from "./types";

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

/** The `type` page param as the server's filter; `undefined` for anything else. */
export const toStaffPeopleResultType = (
  type: string,
): StaffPeopleResultType | undefined =>
  STAFF_PEOPLE_TYPE_OPTIONS.some((option) => option.value === type && type)
    ? (type as StaffPeopleResultType)
    : undefined;

/** The lower-cased emails that two or more people in `results` share. */
export const getDuplicateEmails = (
  results: readonly StaffPeopleResult[],
): Set<string> => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const result of results) {
    if (result.type !== "person") {
      continue;
    }

    const email = result.email.toLowerCase();

    if (seen.has(email)) {
      duplicates.add(email);
    }

    seen.add(email);
  }

  return duplicates;
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
  {
    label: "Org. settings",
    icon: "settings",
    items: SUPPORT_SETTINGS_PAGES.map(({ slug, label }) => ({
      label,
      path: ROUTES.superAdmin.sessionSetting(name, slug),
    })),
  },
];
