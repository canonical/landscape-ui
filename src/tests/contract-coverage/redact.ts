const SENSITIVE_KEY_PATTERN =
  /password|secret|token|apikey|api_key|authorization|privatekey|private_key|credential|accesskey|access_key|secretkey|secret_key|fde_recovery_key|recoverykey|invitation_?id|secure_?id/i;

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
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      result[key] = REDACTED_VALUE;
    } else if (typeof value === "object") {
      result[key] = redactSensitiveFields(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
