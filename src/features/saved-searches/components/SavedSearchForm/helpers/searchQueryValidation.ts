import {
  ALERT_TYPES,
  BOOLEANS,
  DOUBLE_QUOTE_REGEX,
  HARDWARE_ATTRIBUTES,
  HARDWARE_ROOT_KEYS,
  INTEGER_REGEX,
  LICENSE_TYPES,
  LOGICAL_OPERATORS,
  PROFILE_TYPES,
  QUERY_TOKEN_REGEX,
  TRAILING_WHITESPACE_REGEX,
  USG_STATUSES,
  VALID_ROOT_KEYS,
  WSL_STATUSES,
  DISTRIBUTION_UPGRADE_STATUSES,
} from "../constants";

import type {
  BooleanString,
  DistributionUpgradeStatus,
  LicenseType,
  LogicalOperator,
  ProfileType,
  UsgStatus,
  ValidationResult,
  ValidRootKey,
  WslStatus,
} from "../types";

export interface ValidationConfig {
  profileTypes?: readonly string[];
  usgStatuses?: readonly string[];
  wslStatuses?: readonly string[];
}

const isInteger = (val: string) => INTEGER_REGEX.test(val);

const isUsgStatus = (
  s: string,
  allowedStatuses: readonly string[],
): s is UsgStatus => allowedStatuses.includes(s);

const isDistributionUpgradeAvailable = (
  val: string,
): val is DistributionUpgradeStatus =>
  DISTRIBUTION_UPGRADE_STATUSES.includes(val as DistributionUpgradeStatus);

const isWslStatus = (
  s: string,
  allowedStatuses: readonly string[],
): s is WslStatus => allowedStatuses.includes(s);

const isProfileType = (
  t: string,
  allowedTypes: readonly string[],
): t is ProfileType => allowedTypes.includes(t);

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

const validateProfileToken = (
  [, type, id, status]: [unknown, string, string?, string?],
  config: ValidationConfig,
): ValidationResult => {
  const key = "profile";

  const allowedTypes = config.profileTypes ?? PROFILE_TYPES;
  const allowedUsgStatuses = config.usgStatuses ?? USG_STATUSES;
  const allowedWslStatuses = config.wslStatuses ?? WSL_STATUSES;

  if (!isProfileType(type, allowedTypes)) {
    return keyError(key, `has invalid profile type "${type}".`);
  }
  if (!id || !id.trim()) {
    return keyError(key, "requires an ID.");
  }
  if (!isInteger(id)) {
    return keyError(key, "ID must be a number.");
  }

  if (type === "usg" || type === "wsl") {
    if (!status) {
      return keyError(`${key}:${type}`, "requires a status.");
    }

    if (type === "usg" && !isUsgStatus(status, allowedUsgStatuses)) {
      return keyError(
        `${key}:${type}`,
        `has invalid security status "${status}".`,
      );
    }

    if (type === "wsl" && !isWslStatus(status, allowedWslStatuses)) {
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

const validateHardwareToken = (key: string, val: string): ValidationResult => {
  const dotIndex = key.indexOf(".");

  if (dotIndex === -1) {
    const hwRoot = key as keyof typeof HARDWARE_ATTRIBUTES;
    const validAttrs = HARDWARE_ATTRIBUTES[hwRoot].join(", ");
    return keyError(
      key,
      `requires a dot-separated attribute. Valid attributes: ${validAttrs}.`,
    );
  }

  const hwRoot = key.slice(0, dotIndex) as keyof typeof HARDWARE_ATTRIBUTES;
  const attribute = key.slice(dotIndex + 1);

  if (!attribute || !attribute.trim()) {
    const validAttrs = HARDWARE_ATTRIBUTES[hwRoot].join(", ");
    return keyError(
      key,
      `requires an attribute. Valid attributes: ${validAttrs}.`,
    );
  }

  const validAttributes: readonly string[] = HARDWARE_ATTRIBUTES[hwRoot];
  if (!validAttributes.includes(attribute)) {
    const validAttrs = HARDWARE_ATTRIBUTES[hwRoot].join(", ");
    return keyError(
      key,
      `has invalid attribute "${attribute}". Valid attributes: ${validAttrs}.`,
    );
  }

  if (!val || !val.trim()) {
    return keyError(key, "requires a value.");
  }

  return undefined;
};

const validateAnnotationToken = (val: string): ValidationResult => {
  if (val.trim()) {
    return undefined;
  }

  return keyError("annotation", "key cannot be empty.");
};

const validateDistributionUpgradeToken = (val: string): ValidationResult => {
  if (isDistributionUpgradeAvailable(val)) {
    return undefined;
  }

  return keyError("release-upgrade", `has invalid value "${val}".`);
};

const validateKeyToken = (
  parts: [string, string],
  config: ValidationConfig,
): ValidationResult => {
  const [key, val] = parts;

  // Handle hardware dot-notation keys (e.g., cpu.vendor, disk.size)
  const [hwRoot] = key.split(".");
  if (HARDWARE_ROOT_KEYS.includes(hwRoot as keyof typeof HARDWARE_ATTRIBUTES)) {
    return validateHardwareToken(key, val);
  }

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
      return validateProfileToken(parts, config);

    case "annotation":
      return validateAnnotationToken(val);

    case "release-upgrade":
      return validateDistributionUpgradeToken(val);

    case "id":
    case "contract":
    case "contract-expires-within-days":
    case "license-expires-within-days":
    case "last-ping":
      return validateNumericKeyToken(key, val);

    default:
      return undefined;
  }
};

const validateToken = (
  cleanToken: string,
  index: number,
  config: ValidationConfig,
): ValidationResult => {
  if (!cleanToken.includes(":")) {
    return validateBareToken(cleanToken, index);
  }

  const parts = cleanToken.split(":");
  return validateKeyToken(parts as [string, string], config);
};

export const validateSearchQuery = (
  query: string | undefined,
  isSubmit = false,
  config: ValidationConfig = {},
): string | undefined => {
  if (!query || !query.trim()) {
    return undefined;
  }

  const hasTrailingSpace = TRAILING_WHITESPACE_REGEX.test(query);
  const tokens = query.match(QUERY_TOKEN_REGEX) ?? [];
  const lastIndex = tokens.length - 1;

  for (const [i, token] of tokens.entries()) {
    if (!shouldValidateToken(i, lastIndex, isSubmit, hasTrailingSpace)) {
      continue;
    }

    const cleanToken = token.replace(DOUBLE_QUOTE_REGEX, "");
    const error = validateToken(cleanToken, i, config);

    if (error) {
      return error;
    }
  }

  return undefined;
};

export const validateSearchField = (
  query: string | undefined,
  mode: "typing" | "strict",
  config: ValidationConfig = {},
): string | undefined => {
  if (!query || !query.trim()) {
    return "This field is required.";
  }

  if (mode === "typing") {
    return validateSearchQuery(query, false, config);
  }

  return validateSearchQuery(query, true, config);
};
