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

  it("returns invalid JSON as a string", async () => {
    const request = new Request("https://example.com/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    await expect(extractPayload(request)).resolves.toBe("not-json");
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

  it("returns plain text bodies unchanged", async () => {
    const response = new Response("plain text", {
      headers: { "content-type": "text/plain" },
    });
    await expect(extractPayload(response)).resolves.toBe("plain text");
  });
});
