// eslint-disable-next-line no-restricted-imports -- Required to avoid circular dependency with instances/index.ts
import { STATUS_FILTERS } from "@/features/instances/constants";
import type { ValidRootKey } from "./types";

export const ALERT_TYPES = Object.values(STATUS_FILTERS).map(
  (status) => status.filterValue,
);
export const VALID_ROOT_KEYS = [
  "tag",
  "distribution",
  "hostname",
  "title",
  "alert",
  "access-group",
  "id",
  "mac",
  "ip",
  "needs",
  "license-id",
  "annotation",
  "profile",
  "license-type",
  "contract",
  "contract-expires-within-days",
  "license-expires-within-days",
  "has-pro-management",
] as const;
export const PROFILE_TYPES = [
  "security",
  "wsl",
  "script",
  "repository",
  "package",
  "upgrade",
  "reboot",
  "removal",
] as const;
export const USG_STATUSES = ["pass", "fail", "in-progress"] as const;
export const WSL_STATUSES = ["compliant", "noncompliant"] as const;
export const LICENSE_TYPES = [
  "unlicensed",
  "pro",
  "free_pro",
  "legacy",
] as const;
export const BOOLEANS = ["true", "false", "1", "0"] as const;
export const LOGICAL_OPERATORS = ["AND", "OR", "NOT"] as const;
export const NUMERIC_KEYS: ValidRootKey[] = [
  "id",
  "contract",
  "contract-expires-within-days",
  "license-expires-within-days",
];

export const INTEGER_REGEX = /^\d+$/;
export const TRAILING_WHITESPACE_REGEX = /\s$/;
export const QUERY_TOKEN_REGEX = /(?:[^\s"]+|"[^"]*")+/g;
export const LAST_TOKEN_REGEX = /([^\s]+)$/;
export const DOUBLE_QUOTE_REGEX = /"/g;
export const WHITESPACE_TOKEN_REGEX = /\s+/;
export const LOGICAL_OPERATOR_HIGHLIGHT_REGEX = /\b(AND|NOT)\b/;
export const NUMBER_BEFORE_COLON_REGEX = /[0-9]+(?=:)/;
export const KEY_BEFORE_COLON_REGEX = /[a-zA-Z0-9_-]+(?=:)/;
export const QUOTED_STRING_REGEX = /".*?"/;
export const NUMBER_REGEX = /[0-9]+/;
export const COLON_REGEX = /:/;
