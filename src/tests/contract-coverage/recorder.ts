import fs from "fs";
import { RequestHandler } from "msw";
import type { SetupServer } from "msw/node";
import { MANIFEST_PATH, REGISTRY_PATH } from "./paths";
import { redactSensitiveFields } from "./redact";

// Matches "application/json" as well as structured +json suffixes such as
// "application/problem+json" or "application/vnd.api+json", but not
// unrelated types that merely contain the substring "json" (e.g. a
// hypothetical "application/jsonlines").
const JSON_CONTENT_TYPE_PATTERN = /\/(?:[\w.-]+\+)?json\b/i;

/**
 * Safely extracts and parses payloads from cloned network streams. Parses
 * JSON and form-encoded bodies into objects so downstream redaction can key
 * off field names; other bodies are returned as raw strings.
 */
export async function extractPayload(
  streamOwner: Request | Response,
): Promise<unknown> {
  if (!streamOwner.body) return null;
  try {
    const clone = streamOwner.clone();
    const text = await clone.text();
    if (!text) return null;

    const contentType = streamOwner.headers.get("content-type") ?? "";
    if (JSON_CONTENT_TYPE_PATTERN.test(contentType)) {
      try {
        return JSON.parse(text);
      } catch {
        // redactSensitiveFields() only walks object keys, so returning the
        // raw text here would persist an unredacted secret from a
        // truncated/malformed body (e.g. `{"password":"secret"` cut
        // mid-stream) — use a non-sensitive sentinel instead.
        return { __unparseable: true, contentType };
      }
    }
    if (
      /^\s*application\/x-www-form-urlencoded(?:\s*;.*)?\s*$/i.test(contentType)
    ) {
      const params = new URLSearchParams(text);
      const result: Record<string, string | string[]> = {};
      // Object.fromEntries(params.entries()) would silently keep only the
      // last value for a repeated key, losing array-valued fields — collect
      // every value per key instead, and only unwrap to a scalar when the
      // key appeared once.
      for (const key of new Set(params.keys())) {
        const values = params.getAll(key);
        const [firstValue = ""] = values;
        result[key] = values.length > 1 ? values : firstValue;
      }
      return result;
    }
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null; // Fallback if streams are unreadable or locked
  }
}

// Keep JSONL lines short enough for a single O_APPEND write syscall to be
// effectively atomic across concurrent Vitest worker threads. Payloads larger
// than this are replaced with a sentinel so the line stays well under 4 KB.
const MAX_PAYLOAD_BYTES = 2048;

function truncateForLog(payload: unknown): unknown {
  if (payload === null) return null;
  const serialized = JSON.stringify(payload);
  const bytes = Buffer.byteLength(serialized, "utf8");
  if (bytes <= MAX_PAYLOAD_BYTES) return payload;
  return { __truncated: true, originalBytes: bytes };
}

async function logInteraction(request: Request, response: Response) {
  try {
    const requestPayload = truncateForLog(
      redactSensitiveFields(await extractPayload(request)),
    );
    const responsePayload = truncateForLog(
      redactSensitiveFields(await extractPayload(response)),
    );

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status: response.status,
      requestPayload,
      responsePayload,
    };

    await fs.promises.appendFile(
      REGISTRY_PATH,
      JSON.stringify(logEntry) + "\n",
    );
  } catch (error) {
    console.error("Failed to write MSW interaction registry entry:", error);
  }
}

// Dump the declared handler patterns for the coverage aggregator, which runs
// outside Vite and cannot import the handler modules (import.meta.env).
// Content is identical across workers, so only the first writer wins.
// A failed write must fail hard — a stale manifest would silently skew the
// coverage report.
function writeHandlerManifest(server: SetupServer) {
  try {
    const manifest = server
      .listHandlers()
      .filter((handler) => handler instanceof RequestHandler)
      .map((handler) => {
        const info = handler.info as { method?: unknown; path?: unknown };
        return {
          method: String(info.method ?? ""),
          path: String(info.path ?? ""),
          isRegExpPath: info.path instanceof RegExp,
        };
      });
    try {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), {
        flag: "wx",
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
    }
  } catch (error) {
    throw new Error(
      `[FATAL] MSW manifest write failed at ${MANIFEST_PATH}: ${String(error)}`,
    );
  }
}

/**
 * Records every mocked request/response to the registry and dumps the handler
 * manifest. Must be called before any test sends traffic. Returns a function
 * that resolves once all pending registry writes have settled.
 */
export function installContractCoverageRecorder(
  server: SetupServer,
): () => Promise<void> {
  const pendingLogs: Promise<void>[] = [];

  server.events.on("response:mocked", ({ request, response }) => {
    const p = logInteraction(request, response).finally(() => {
      const idx = pendingLogs.indexOf(p);
      if (idx !== -1) pendingLogs.splice(idx, 1);
    });
    pendingLogs.push(p);
  });

  // Only write the manifest once per run: skip the listHandlers()/serialize
  // work in every later test file once the first worker has created it.
  if (!fs.existsSync(MANIFEST_PATH)) {
    writeHandlerManifest(server);
  }

  return async () => {
    await Promise.allSettled(pendingLogs);
  };
}
