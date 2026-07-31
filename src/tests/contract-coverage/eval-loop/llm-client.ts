/**
 * Zero-dependency LLM client for the eval loop. One OpenAI-compatible client
 * shape covers GitHub Models today and OpenRouter/Gemini later — switching
 * providers is a base-URL/key configuration change, never a code change.
 * The API key is read only inside createLlmClientFromEnv and never logged.
 */

export interface CompletionRequest {
  system: string;
  user: string;
  maxTokens?: number;
}

export interface CompletionResult {
  text: string;
  model: string;
}

export interface LlmClient {
  complete(req: CompletionRequest): Promise<CompletionResult>;
}

export interface OpenAiCompatibleClient extends LlmClient {
  readonly baseUrl: string;
  readonly model: string;
}

interface ClientOptions {
  apiKey: string;
  baseUrl: string;
  model: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  backoffMs?: number;
}

const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_BACKOFF_MS = 2_000;
const DEFAULT_MAX_TOKENS = 4096;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR_MIN = 500;
const HTTP_SERVER_ERROR_MAX = 600;
const ERROR_BODY_TRUNCATE = 500;
const RETRYABLE = (status: number): boolean =>
  status === HTTP_TOO_MANY_REQUESTS ||
  (status >= HTTP_SERVER_ERROR_MIN && status < HTTP_SERVER_ERROR_MAX);

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isTimeoutError = (error: unknown): boolean =>
  error instanceof Error &&
  (error.name === "TimeoutError" || error.name === "AbortError");

async function extractContent(response: Response): Promise<string> {
  const raw = await response.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `unexpected response shape: ${raw.slice(0, ERROR_BODY_TRUNCATE)}`,
    );
  }
  const { choices } = parsed as { choices?: unknown };
  const content =
    Array.isArray(choices) && choices.length > 0
      ? (choices[0] as { message?: { content?: unknown } }).message?.content
      : undefined;
  if (typeof content !== "string") {
    throw new Error(
      `unexpected response shape: ${raw.slice(0, ERROR_BODY_TRUNCATE)}`,
    );
  }
  return content;
}

export function createOpenAiCompatibleClient(
  options: ClientOptions,
): OpenAiCompatibleClient {
  const {
    apiKey,
    baseUrl,
    model,
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    backoffMs = DEFAULT_BACKOFF_MS,
  } = options;

  const attempt = async (req: CompletionRequest): Promise<Response> => {
    try {
      return await fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: req.user },
          ],
          temperature: 0,
          max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (isTimeoutError(error)) {
        throw new Error(`LLM request timed out after ${timeoutMs}ms`);
      }
      throw error;
    }
  };

  return {
    baseUrl,
    model,
    async complete(req: CompletionRequest): Promise<CompletionResult> {
      let response = await attempt(req);
      if (!response.ok && RETRYABLE(response.status)) {
        await sleep(backoffMs);
        response = await attempt(req);
      }
      if (!response.ok) {
        const body = (await response.text()).slice(0, ERROR_BODY_TRUNCATE);
        throw new Error(
          `LLM request failed: HTTP ${response.status} — ${body}`,
        );
      }
      return { text: await extractContent(response), model };
    },
  };
}

const DEFAULT_BASE_URL = "https://models.github.ai/inference";
const DEFAULT_MODEL = "gpt-4o-mini";

/** Build a client from environment variables (LLM_API_KEY required). */
export function createLlmClientFromEnv(
  env: Partial<Record<string, string>> = process.env,
): OpenAiCompatibleClient {
  const apiKey = env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Set LLM_API_KEY (a PAT with models:read) to run the eval loop",
    );
  }
  return createOpenAiCompatibleClient({
    apiKey,
    baseUrl: env.LLM_BASE_URL ?? DEFAULT_BASE_URL,
    model: env.LLM_MODEL ?? DEFAULT_MODEL,
  });
}

/** Fixed-response client for tests and LLM_MOCK=1 dry-runs. */
export function createMockClient(responseText: string): LlmClient {
  return {
    complete: () => Promise.resolve({ text: responseText, model: "mock" }),
  };
}
