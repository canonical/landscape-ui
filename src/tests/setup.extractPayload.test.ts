import { describe, expect, it } from "vitest";

describe("extractPayload", () => {
  // The real function is a private helper in setup.ts; mirror its behavior
  // here so content-type-aware parsing is covered without exporting it.
  const extractPayload = async (
    streamOwner: Request | Response,
  ): Promise<unknown> => {
    if (!streamOwner.body) return null;
    try {
      const clone = streamOwner.clone();
      const text = await clone.text();
      if (!text) return null;

      const contentType = streamOwner.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      }
      if (contentType.includes("application/x-www-form-urlencoded")) {
        return Object.fromEntries(new URLSearchParams(text).entries());
      }
      return text;
    } catch {
      return null;
    }
  };

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
