import { describe, expect, it } from "vitest";
import { extractPayload } from "./setup";

describe("extractPayload", () => {
  it("returns null for an empty body", async () => {
    const request = new Request("https://example.com/api", { method: "GET" });
    await expect(extractPayload(request)).resolves.toBeNull();
  });

  it("parses JSON bodies", async () => {
    const request = new Request("https://example.com/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "test" }),
    });
    await expect(extractPayload(request)).resolves.toEqual({ name: "test" });
  });

  it("replaces unparseable JSON with a non-sensitive sentinel instead of the raw body", async () => {
    const request = new Request("https://example.com/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    await expect(extractPayload(request)).resolves.toEqual({
      __unparseable: true,
      contentType: "application/json",
    });
  });

  it("does not leak a secret embedded in a truncated/malformed JSON body", async () => {
    // redactSensitiveFields() only walks object keys, so a raw string here
    // (the old behavior) would persist the secret verbatim.
    const request = new Request("https://example.com/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"password":"super-secret-value"', // truncated mid-stream
    });
    const result = await extractPayload(request);
    expect(JSON.stringify(result)).not.toContain("super-secret-value");
  });

  it("parses form-encoded bodies into an object", async () => {
    const request = new Request("https://example.com/api", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "password=secret&username=admin",
    });
    await expect(extractPayload(request)).resolves.toEqual({
      password: "secret",
      username: "admin",
    });
  });

  it("preserves all values for repeated form-encoded keys as an array", async () => {
    const request = new Request("https://example.com/api", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "series=focal&series=jammy&name=my-mirror",
    });
    await expect(extractPayload(request)).resolves.toEqual({
      series: ["focal", "jammy"],
      name: "my-mirror",
    });
  });

  it("returns plain text bodies unchanged", async () => {
    const response = new Response("plain text", {
      headers: { "content-type": "text/plain" },
    });
    await expect(extractPayload(response)).resolves.toBe("plain text");
  });

  it("parses +json media-type suffixes (problem+json, vnd.api+json) as JSON", async () => {
    const problemResponse = new Response(
      JSON.stringify({ error: "bad request", token: "secret" }),
      { headers: { "content-type": "application/problem+json" } },
    );
    await expect(extractPayload(problemResponse)).resolves.toEqual({
      error: "bad request",
      token: "secret",
    });

    const vendorResponse = new Response(JSON.stringify({ id: 1 }), {
      headers: { "content-type": "application/vnd.api+json; charset=utf-8" },
    });
    await expect(extractPayload(vendorResponse)).resolves.toEqual({ id: 1 });
  });

  it("does not treat a non-JSON type that merely contains 'json' as JSON", async () => {
    const response = new Response("not-json-body", {
      headers: { "content-type": "application/jsonlines" },
    });
    await expect(extractPayload(response)).resolves.toBe("not-json-body");
  });
});
