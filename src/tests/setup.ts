import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup, configure } from "@testing-library/react";
import fs from "fs";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { setEndpointStatus } from "./controllers/controller";
import { MANIFEST_PATH, REGISTRY_PATH } from "./contract-coverage/paths";
import {
  mockRangeBoundingClientRect,
  resetScreenSize,
  restoreRangeBoundingClientRect,
} from "./helpers";
import "./matcher";
import server from "./server";
import { resetPublicationTargets } from "./server/handlers/publicationTargets";
import { resetMirrors } from "./server/handlers/mirrors";

expect.extend(matchers);

// Configure timeout limits for CI headroom
configure({ asyncUtilTimeout: 5000 });

// --- MSW Interaction Recorder Config ---

/**
 * Safely extracts and parses payloads from cloned network streams
 */
async function extractPayload(streamOwner: Request | Response) {
  if (!streamOwner.body) return null;
  try {
    const clone = streamOwner.clone();
    const text = await clone.text();
    try {
      return JSON.parse(text);
    } catch {
      return text || null;
    }
  } catch {
    return null; // Fallback if streams are unreadable or locked
  }
}

async function logInteraction(request: Request, response: Response) {
  try {
    const requestPayload = await extractPayload(request);
    const responsePayload = await extractPayload(response);

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status: response.status,
      requestPayload,
      responsePayload,
    };

    // Concurrent appends from parallel Vitest workers may theoretically interleave,
    // but JSONL line-length is short enough that OS-level write buffering makes
    // corruption extremely unlikely in practice.
    fs.appendFileSync(REGISTRY_PATH, JSON.stringify(logEntry) + "\n");
  } catch (error) {
    console.error("Failed to write MSW interaction registry entry:", error);
  }
}

const pendingLogs: Promise<void>[] = [];

// Attach listeners immediately to capture traffic in this worker's context
server.events.on("response:mocked", ({ request, response }) => {
  pendingLogs.push(logInteraction(request, response));
});

// Dump the declared handler patterns for the coverage aggregator, which runs
// outside Vite and cannot import the handler modules (import.meta.env).
// Content is identical across workers, so concurrent rewrites are harmless.
// A failed write must fail hard — a stale manifest would silently skew the
// coverage report.
try {
  const manifest = server.listHandlers().map((handler) => {
    const info = handler.info as { method?: unknown; path?: unknown };
    return {
      method: String(info.method ?? ""),
      path: String(info.path ?? ""),
      isRegExpPath: info.path instanceof RegExp,
    };
  });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
} catch (error) {
  throw new Error(
    `[FATAL] MSW manifest write failed at ${MANIFEST_PATH}: ${String(error)}`,
  );
}

// ----------------------------------------

interface ResizeObserverInstance {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

const ResizeObserver = vi.fn(function ResizeObserverMock(
  this: ResizeObserverInstance,
) {
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
});

vi.stubGlobal("ResizeObserver", ResizeObserver);

HTMLCanvasElement.prototype.getContext = (() => {
  return { webkitBackingStorePixelRatio: 1 };
}) as unknown as HTMLCanvasElement["getContext"];

document.queryCommandSupported = vi.fn(() => true);

if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = function scrollIntoView() {
    /* no-op */
  };
}

if (typeof globalThis.ProgressEvent === "undefined") {
  class TestProgressEvent extends Event implements ProgressEvent<EventTarget> {
    lengthComputable = false;
    loaded = 0;
    total = 0;

    constructor(type: string, eventInitDict?: ProgressEventInit) {
      super(type, eventInitDict);
      if (eventInitDict) {
        this.lengthComputable = eventInitDict.lengthComputable ?? false;
        this.loaded = eventInitDict.loaded ?? 0;
        this.total = eventInitDict.total ?? 0;
      }
    }
  }

  globalThis.ProgressEvent = TestProgressEvent;
}

if (typeof Blob.prototype.stream !== "function") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Blob.prototype as any).stream = function stream(this: Blob) {
    return new ReadableStream<Uint8Array>({
      start: async (controller) => {
        try {
          const buffer = await this.arrayBuffer();
          controller.enqueue(new Uint8Array(buffer));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  };
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  mockRangeBoundingClientRect();
  resetScreenSize();
});

afterAll(async () => {
  await Promise.allSettled(pendingLogs);
  server.close();
  restoreRangeBoundingClientRect();
});

afterEach(() => {
  resetPublicationTargets();
  resetMirrors();
  setEndpointStatus("default");
  server.resetHandlers();
  cleanup();
  resetScreenSize();
});
