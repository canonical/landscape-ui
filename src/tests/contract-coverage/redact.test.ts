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
      signature: "signature-value",
      fde_recovery_key: "RECOVERY-KEY-VALUE",
      recoveryKey: "recovery-key-value-2",
    };

    expect(redactSensitiveFields(input)).toEqual({
      awsAccessKeyId: "***REDACTED***",
      awsSecretAccessKey: "***REDACTED***",
      access_key: "***REDACTED***",
      secret_key: "***REDACTED***",
      access_key_id: "***REDACTED***",
      signature: "***REDACTED***",
      fde_recovery_key: "***REDACTED***",
      recoveryKey: "***REDACTED***",
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
