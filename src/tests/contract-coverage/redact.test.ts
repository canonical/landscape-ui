import { describe, expect, it } from "vitest";
import { redactSensitiveFields } from "./redact";

const NON_REDACTED_NUM = 42;

describe("redactSensitiveFields", () => {
  it("passes through primitives unchanged", () => {
    expect(redactSensitiveFields("hello")).toBe("hello");
    expect(redactSensitiveFields(NON_REDACTED_NUM)).toBe(NON_REDACTED_NUM);
    expect(redactSensitiveFields(true)).toBe(true);
    expect(redactSensitiveFields(null)).toBe(null);
    expect(redactSensitiveFields(undefined)).toBe(undefined);
  });

  it("redacts sensitive scalar fields at the top level", () => {
    const input = {
      username: "admin",
      password: "secret",
      token: "abc123",
      apiKey: "key",
      api_key: "key",
      authorization: "Bearer xyz",
      privateKey: "-----BEGIN",
      credential: "ssh-rsa",
    };

    expect(redactSensitiveFields(input)).toEqual({
      username: "admin",
      password: "***REDACTED***",
      token: "***REDACTED***",
      apiKey: "***REDACTED***",
      api_key: "***REDACTED***",
      authorization: "***REDACTED***",
      privateKey: "***REDACTED***",
      credential: "***REDACTED***",
    });
  });

  it("redacts AWS, access-key, and recovery-key credential families", () => {
    const input = {
      awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE",
      awsSecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      access_key: "access-key-2",
      secret_key: "secret-key-2",
      access_key_id: "access-key-id",
      fde_recovery_key: "RECOVERY-KEY-VALUE",
      recoveryKey: "recovery-key-value-2",
    };

    expect(redactSensitiveFields(input)).toEqual({
      awsAccessKeyId: "***REDACTED***",
      awsSecretAccessKey: "***REDACTED***",
      access_key: "***REDACTED***",
      secret_key: "***REDACTED***",
      access_key_id: "***REDACTED***",
      fde_recovery_key: "***REDACTED***",
      recoveryKey: "***REDACTED***",
    });
  });

  it("redacts gpgKey fields, including the nested armor block", () => {
    const input = {
      displayName: "My Mirror",
      gpgKey: {
        armor:
          "-----BEGIN PGP PRIVATE KEY BLOCK-----\n...\n-----END PGP PRIVATE KEY BLOCK-----",
      },
    };

    expect(redactSensitiveFields(input)).toEqual({
      displayName: "My Mirror",
      gpgKey: "***REDACTED***",
    });
  });

  it("redacts nested sensitive fields recursively", () => {
    const input = {
      displayName: "My Target",
      swift: {
        container: "my-container",
        username: "admin",
        password: "secret",
        authUrl: "https://keystone.example.com/v3",
      },
    };

    expect(redactSensitiveFields(input)).toEqual({
      displayName: "My Target",
      swift: {
        container: "my-container",
        username: "admin",
        password: "***REDACTED***",
        authUrl: "https://keystone.example.com/v3",
      },
    });
  });

  it("redacts sensitive fields inside arrays", () => {
    const input = [
      { name: "one", token: "a" },
      { name: "two", token: "b" },
    ];

    expect(redactSensitiveFields(input)).toEqual([
      { name: "one", token: "***REDACTED***" },
      { name: "two", token: "***REDACTED***" },
    ]);
  });

  it("redacts fields containing sensitive tokens case-insensitively", () => {
    const input = {
      AccessToken: "tok",
      SECRET_VALUE: "val",
      currentPassword: "pwd",
    };

    expect(redactSensitiveFields(input)).toEqual({
      AccessToken: "***REDACTED***",
      SECRET_VALUE: "***REDACTED***",
      currentPassword: "***REDACTED***",
    });
  });

  it("preserves non-sensitive fields", () => {
    const input = {
      id: "123",
      name: "test",
      description: "nothing sensitive here",
      count: 7,
      enabled: true,
      nested: {
        url: "https://example.com",
        method: "POST",
      },
    };

    expect(redactSensitiveFields(input)).toEqual(input);
  });

  it("does not redact boolean flag fields with password/token/etc. as a prefix", () => {
    const input = {
      has_password: true,
      hasToken: false,
      password: "secret",
      token: "abc123",
    };

    expect(redactSensitiveFields(input)).toEqual({
      has_password: true,
      hasToken: false,
      password: "***REDACTED***",
      token: "***REDACTED***",
    });
  });

  it("redacts a real secret even when the key has a has_/no_ prefix", () => {
    const input = {
      hasToken: "eyJhbGciOiJIUzI1NiJ9.jwt-value",
      has_password: "not-a-boolean-secret",
      no_password: "another-secret",
      has_secret: false,
    };

    expect(redactSensitiveFields(input)).toEqual({
      hasToken: "***REDACTED***",
      has_password: "***REDACTED***",
      no_password: "***REDACTED***",
      has_secret: false,
    });
  });

  it("strips embedded credentials from a URL value under a non-sensitive key", () => {
    // Matches the AddMirrorForm ubuntu-pro flow: the bearer token is embedded
    // as URL userinfo in `archiveRoot`, a key that doesn't match
    // SENSITIVE_KEY_PATTERN, so only value-level sanitization catches it.
    const input = {
      archiveRoot: "https://bearer:SECRETTOKEN@esm.ubuntu.com/apps/ubuntu",
    };

    const result = redactSensitiveFields(input) as typeof input;

    expect(result.archiveRoot).toBe("https://esm.ubuntu.com/apps/ubuntu");
    expect(JSON.stringify(result)).not.toContain("SECRETTOKEN");
  });

  it("scrubs sensitive query parameters in URL values while preserving others", () => {
    const input = {
      webhookUrl: "https://example.com/hook?api_key=SECRET123&channel=alerts",
    };

    const result = redactSensitiveFields(input) as typeof input;
    const resultUrl = new URL(result.webhookUrl);

    expect(resultUrl.searchParams.get("api_key")).toBe("***REDACTED***");
    expect(resultUrl.searchParams.get("channel")).toBe("alerts");
  });

  it("leaves URL values without embedded credentials or sensitive params unchanged", () => {
    const input = { archiveRoot: "https://esm.ubuntu.com/apps/ubuntu" };

    expect(redactSensitiveFields(input)).toEqual(input);
  });

  it("leaves non-URL string values with an @ symbol unchanged", () => {
    const input = { note: "contact us at support@example.com for help" };

    expect(redactSensitiveFields(input)).toEqual(input);
  });

  it("sanitizes a bare top-level URL string payload", () => {
    expect(redactSensitiveFields("https://bearer:SECRETTOKEN@host/path")).toBe(
      "https://host/path",
    );
  });

  it("returns a deep copy so the original is not mutated", () => {
    const input = {
      nested: {
        password: "secret",
      },
    };
    const output = redactSensitiveFields(input) as typeof input;

    expect(output.nested.password).toBe("***REDACTED***");
    expect(input.nested.password).toBe("secret");
  });
});
