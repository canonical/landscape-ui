const SENSITIVE_KEY_PATTERN =
  /(password|secret|token|apikey|api_key|authorization|privatekey|private_key|credential|accesskey|access_key|secretkey|secret_key|fde_recovery_key|recoverykey|invitation_?id|secure_?id|gpg_?key)/i;

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

/**
 * Recursively redact values whose keys contain sensitive tokens.
 *
 * Used before persisting MSW interactions or transmitting contract payloads
 * to an external LLM, so credentials/tokens/passwords cannot leak into
 * artifacts or leave the CI environment.
 */
export function redactSensitiveFields(payload: unknown): unknown {
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
    } else {
      result[key] = value;
    }
  }

  return result;
}
