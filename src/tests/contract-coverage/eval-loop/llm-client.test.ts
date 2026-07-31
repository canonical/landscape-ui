import { describe, expect, it } from "vitest";
import {
  createLlmClientFromEnv,
  createMockClient,
  createOpenAiCompatibleClient,
} from "./llm-client";

const okResponse = (body: unknown): Response =>
  new Response(JSON.stringify(body), { status: 200 });

const chatBody = (content: unknown): unknown => ({
  choices: [{ message: { content } }],
});

const client = (
  fetchImpl: typeof fetch,
  overrides: Partial<Parameters<typeof createOpenAiCompatibleClient>[0]> = {},
) =>
  createOpenAiCompatibleClient({
    apiKey: "test-key",
    baseUrl: "https://example.test/inference",
    model: "test-model",
    fetchImpl,
    backoffMs: 1,
    ...overrides,
  });

describe("createOpenAiCompatibleClient.complete", () => {
  it("sends an OpenAI-shaped chat completion and returns the content", async () => {
    const requests: { url: unknown; init?: RequestInit }[] = [];
    const fetchImpl = (async (url: unknown, init?: RequestInit) => {
      requests.push({ url, init });
      return okResponse(chatBody("hello world"));
    }) as typeof fetch;

    const result = await client(fetchImpl).complete({
      system: "be terse",
      user: "say hi",
    });

    expect(result).toEqual({ text: "hello world", model: "test-model" });
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe(
      "https://example.test/inference/chat/completions",
    );
    const headers = requests[0].init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-key");
    expect(headers["Content-Type"]).toBe("application/json");
    const body = JSON.parse(requests[0].init?.body as string) as {
      model: string;
      temperature: number;
      max_tokens: number;
      messages: { role: string; content: string }[];
    };
    expect(body.model).toBe("test-model");
    expect(body.temperature).toBe(0);
    expect(body.max_tokens).toBe(4096);
    expect(body.messages).toEqual([
      { role: "system", content: "be terse" },
      { role: "user", content: "say hi" },
    ]);
  });

  it("respects a custom maxTokens", async () => {
    const bodies: string[] = [];
    const fetchImpl = (async (_url: unknown, init?: RequestInit) => {
      bodies.push(init?.body as string);
      return okResponse(chatBody("ok"));
    }) as typeof fetch;

    await client(fetchImpl).complete({
      system: "s",
      user: "u",
      maxTokens: 128,
    });
    expect(JSON.parse(bodies[0])).toMatchObject({ max_tokens: 128 });
  });

  it("throws status + truncated body on non-2xx", async () => {
    const fetchImpl = (async () =>
      new Response("x".repeat(1000), { status: 401 })) as typeof fetch;

    await expect(
      client(fetchImpl).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/401/);
    await expect(
      client(fetchImpl).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/x{500}/);
  });

  it("retries once on 429 and succeeds", async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return calls === 1
        ? new Response("rate limited", { status: 429 })
        : okResponse(chatBody("after retry"));
    }) as typeof fetch;

    const result = await client(fetchImpl).complete({ system: "s", user: "u" });
    expect(result.text).toBe("after retry");
    expect(calls).toBe(2);
  });

  it("gives up after one retry on persistent 429", async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return new Response("rate limited", { status: 429 });
    }) as typeof fetch;

    await expect(
      client(fetchImpl).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/429/);
    expect(calls).toBe(2);
  });

  it("retries once on 5xx", async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return new Response("boom", { status: 500 });
    }) as typeof fetch;

    await expect(
      client(fetchImpl).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/500/);
    expect(calls).toBe(2);
  });

  it("throws 'unexpected response shape' on non-JSON success body", async () => {
    const fetchImpl = (async () =>
      new Response("not json at all", { status: 200 })) as typeof fetch;

    await expect(
      client(fetchImpl).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/unexpected response shape/i);
  });

  it("throws 'unexpected response shape' when content is missing", async () => {
    const fetchImpl = (async () =>
      okResponse({ choices: [{ message: {} }] })) as typeof fetch;

    await expect(
      client(fetchImpl).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/unexpected response shape/i);
  });

  it("rejects with a timeout error when the request hangs", async () => {
    const fetchImpl = ((_url: unknown, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation timed out.", "TimeoutError"));
        });
      })) as typeof fetch;

    await expect(
      client(fetchImpl, { timeoutMs: 50 }).complete({ system: "s", user: "u" }),
    ).rejects.toThrow(/timed? ?out/i);
  });
});

describe("createLlmClientFromEnv", () => {
  it("requires LLM_API_KEY with an actionable message", () => {
    expect(() => {
      createLlmClientFromEnv({});
    }).toThrow(/LLM_API_KEY.*models:read/);
  });

  it("defaults to the GitHub Models endpoint and gpt-4o-mini", () => {
    const envClient = createLlmClientFromEnv({ LLM_API_KEY: "k" });
    expect(envClient.baseUrl).toBe("https://models.github.ai/inference");
    expect(envClient.model).toBe("gpt-4o-mini");
  });

  it("honors LLM_BASE_URL and LLM_MODEL overrides", () => {
    const envClient = createLlmClientFromEnv({
      LLM_API_KEY: "k",
      LLM_BASE_URL: "https://openrouter.ai/api/v1",
      LLM_MODEL: "google/gemini-2.0-flash-001",
    });
    expect(envClient.baseUrl).toBe("https://openrouter.ai/api/v1");
    expect(envClient.model).toBe("google/gemini-2.0-flash-001");
  });
});

describe("createMockClient", () => {
  it("returns the canned response", async () => {
    const mock = createMockClient("canned");
    await expect(mock.complete({ system: "s", user: "u" })).resolves.toEqual({
      text: "canned",
      model: "mock",
    });
  });
});
