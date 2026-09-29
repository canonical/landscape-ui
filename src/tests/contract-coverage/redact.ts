const SENSITIVE_KEY_PATTERN =
  /(password|secret|token|apikey|api_key|authorization|privatekey|private_key|credential|accesskey|access_key|secretkey|secret_key|fde_recovery_key|recoverykey|invitation_?id|secure_?id|license_?url|gpg_?key)/i;

// "has_"/"no_" (and camelCase "has"/"no") immediately before a sensitive
// token name a boolean presence flag, e.g. `has_password`, `hasToken`.
// Matched on the key alone, so it must also be gated on the value actually
// being a boolean below — a string value under one of these key shapes is a
// real secret (e.g. `hasToken: "<jwt>"`), not a presence flag.
const BOOLEAN_FLAG_KEY_PATTERN = new RegExp(
  `(has_?|no_?)${SENSITIVE_KEY_PATTERN.source}`,
  "i",
);

const REDACTED_VALUE = "***REDACTED***";

// Cheap pre-check before the try/catch `new URL()` parse below, so plain
// strings (the overwhelming majority of values) skip URL parsing entirely.
const URL_LIKE_PATTERN = /^[a-z][a-z\d+.-]*:\/\//i;

/**
 * A key-based scan can't catch a credential embedded *inside* an
 * otherwise-benign string value (e.g. a bearer token as URL userinfo in an
 * `archiveRoot` field, which doesn't match SENSITIVE_KEY_PATTERN). Strip URL
 * userinfo and scrub sensitive query parameters; leave everything else
 * (host, path, non-sensitive params) intact for debuggability, and leave
 * non-URL strings and credential-free URLs byte-for-byte unchanged.
 */
function sanitizeEmbeddedCredentials(value: string): string {
  if (!URL_LIKE_PATTERN.test(value)) {
    return value;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }

  let changed = false;
  if (url.username || url.password) {
    url.username = "";
    url.password = "";
    changed = true;
  }
  for (const key of [...url.searchParams.keys()]) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      url.searchParams.set(key, REDACTED_VALUE);
      changed = true;
    }
  }

  return changed ? url.href : value;
}

/**
 * Recursively redact values whose keys contain sensitive tokens, and
 * sanitize credentials embedded within string values themselves (see
 * sanitizeEmbeddedCredentials).
 *
 * Used before persisting MSW interactions or transmitting contract payloads
 * to an external LLM, so credentials/tokens/passwords cannot leak into
 * artifacts or leave the CI environment.
 */
export function redactSensitiveFields(payload: unknown): unknown {
  if (typeof payload === "string") {
    return sanitizeEmbeddedCredentials(payload);
  }

  if (payload === null || typeof payload !== "object") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(redactSensitiveFields);
  }

  const record = payload as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    const isSensitiveKey = SENSITIVE_KEY_PATTERN.test(key);
    const isBooleanPresenceFlag =
      isSensitiveKey &&
      typeof value === "boolean" &&
      BOOLEAN_FLAG_KEY_PATTERN.test(key);
    if (isSensitiveKey && !isBooleanPresenceFlag) {
      result[key] = REDACTED_VALUE;
    } else if (typeof value === "object") {
      result[key] = redactSensitiveFields(value);
    } else if (typeof value === "string") {
      result[key] = sanitizeEmbeddedCredentials(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
