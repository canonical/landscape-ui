import {
  ALERT_TYPES,
  PROFILE_TYPES,
  USG_STATUSES,
  WSL_STATUSES,
  LICENSE_TYPES,
  BOOLEANS,
  LOGICAL_OPERATORS,
  VALID_ROOT_KEYS,
  INTEGER_REGEX,
  TRAILING_WHITESPACE_REGEX,
  QUERY_TOKEN_REGEX,
  DOUBLE_QUOTE_REGEX,
} from "../constants";

import type {
  BooleanString,
  LicenseType,
  LogicalOperator,
  ProfileType,
  UsgStatus,
  ValidationResult,
  ValidRootKey,
  WslStatus,
} from "../types";

const isInteger = (val: string) => INTEGER_REGEX.test(val);

const isUsgStatus = (s: string): s is UsgStatus =>
  USG_STATUSES.includes(s as UsgStatus);

const isWslStatus = (s: string): s is WslStatus =>
  WSL_STATUSES.includes(s as WslStatus);

const isProfileType = (t: string): t is ProfileType =>
  PROFILE_TYPES.includes(t as ProfileType);

const isLicenseType = (t: string): t is LicenseType =>
  LICENSE_TYPES.includes(t as LicenseType);

const isBooleanString = (b: string): b is BooleanString =>
  BOOLEANS.includes(b as BooleanString);

const isLogicalOperator = (op: string): op is LogicalOperator =>
  LOGICAL_OPERATORS.includes(op as LogicalOperator);

const isValidRootKey = (key: string): key is ValidRootKey =>
  VALID_ROOT_KEYS.includes(key as ValidRootKey);

const keyError = (key: string, message: string) => `"${key}" ${message}`;

const shouldValidateToken = (
  index: number,
  lastIndex: number,
  isSubmit: boolean,
  hasTrailingSpace: boolean,
): boolean => {
  const isLastToken = index === lastIndex;
  if (!isLastToken || isSubmit || hasTrailingSpace) {
    return true;
  }

  return false;
};

const validateBareToken = (token: string, index: number): ValidationResult => {
  const upper = token.toUpperCase();

  if (isLogicalOperator(upper)) {
    if (index === 0 && (upper === "AND" || upper === "OR")) {
      return `"${upper}" cannot start a query.`;
    }

    return undefined;
  }

  return undefined;
};

const validateAlertToken = (val: string): ValidationResult => {
  if (ALERT_TYPES.includes(val)) {
    return undefined;
  }

  return keyError("alert", `has invalid value "${val}".`);
};

const validateLicenseTypeToken = (val: string): ValidationResult => {
  if (isLicenseType(val)) {
    return undefined;
  }

  return keyError("license-type", `has invalid value "${val}".`);
};

const validateHasProManagementToken = (val: string): ValidationResult => {
  if (isBooleanString(val)) {
    return undefined;
  }

  return keyError(
    "has-pro-management",
    'must be "true", "false", "1", or "0".',
  );
};

const validateNeedsToken = (val: string): ValidationResult => {
  if (["reboot", "license"].includes(val)) {
    return undefined;
  }

  return keyError("needs", `has invalid value "${val}".`);
};

const validateProfileToken = (parts: string[]): ValidationResult => {
  const typeIndex = 1;
  const idIndex = 2;
  const statusIndex = 3;
  const key = "profile";

  const type = parts[typeIndex];
  const id = parts[idIndex];
  const status = parts[statusIndex];

  if (!isProfileType(type)) {
    return keyError(key, `has invalid profile type "${type}".`);
  }
  if (!id || !id.trim()) {
    return keyError(key, "requires an ID.");
  }
  if (!isInteger(id)) {
    return keyError(key, "ID must be a number.");
  }

  if (type === "security" || type === "wsl") {
    if (!status) {
      return keyError(`${key}:${type}`, "requires a status.");
    }

    if (type === "security" && !isUsgStatus(status)) {
      return keyError(
        `${key}:${type}`,
        `has invalid security status "${status}".`,
      );
    }

    if (type === "wsl" && !isWslStatus(status)) {
      return keyError(`${key}:${type}`, `has invalid WSL status "${status}".`);
    }
  }

  return undefined;
};

const validateNumericKeyToken = (
  key: string,
  val: string,
): ValidationResult => {
  if (isInteger(val)) {
    return undefined;
  }

  return keyError(key, "requires a number.");
};

const validateAnnotationToken = (val: string): ValidationResult => {
  if (val.trim()) {
    return undefined;
  }

  return keyError("annotation", "key cannot be empty.");
};

const validateKeyToken = (parts: string[]): ValidationResult => {
  const keyIndex = 0;
  const valIndex = 1;
  const key = parts[keyIndex];
  const val = parts[valIndex];

  if (!isValidRootKey(key)) {
    return keyError(key, "is not a valid query key.");
  }

  if (!val || !val.trim()) {
    return keyError(key, "requires a value.");
  }

  switch (key) {
    case "alert":
      return validateAlertToken(val);

    case "license-type":
      return validateLicenseTypeToken(val);

    case "has-pro-management":
      return validateHasProManagementToken(val);

    case "needs":
      return validateNeedsToken(val);

    case "profile":
      return validateProfileToken(parts);

    case "annotation":
      return validateAnnotationToken(val);

    case "id":
    case "contract":
    case "contract-expires-within-days":
    case "license-expires-within-days":
      return validateNumericKeyToken(key, val);

    default:
      return undefined;
  }
};

const validateToken = (cleanToken: string, index: number): ValidationResult => {
  if (!cleanToken.includes(":")) {
    return validateBareToken(cleanToken, index);
  }

  const parts = cleanToken.split(":");
  return validateKeyToken(parts);
};

export const validateSearchQuery = (
  query: string | undefined,
  isSubmit = false,
): string | undefined => {
  if (!query || !query.trim()) {
    return undefined;
  }

  const hasTrailingSpace = TRAILING_WHITESPACE_REGEX.test(query);
  const tokens = query.match(QUERY_TOKEN_REGEX) ?? [];
  const lastIndex = tokens.length - 1;

  for (let i = 0; i < tokens.length; i++) {
    if (!shouldValidateToken(i, lastIndex, isSubmit, hasTrailingSpace)) {
      continue;
    }

    const token = tokens[i];
    const cleanToken = token.replace(DOUBLE_QUOTE_REGEX, "");
    const error = validateToken(cleanToken, i);

    if (error) {
      return error;
    }
  }

  return undefined;
};

export const validateSearchField = (
  query: string | undefined,
  mode: "typing" | "strict",
): string | undefined => {
  if (!query || !query.trim()) {
    return "This field is required.";
  }

  if (mode === "typing") {
    return validateSearchQuery(query, false);
  }

  return validateSearchQuery(query, true);
};
