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

// Async DOM waits (findBy*, waitFor, waitForElementToBeRemoved) default to
// 1000ms, which is too tight under the full coverage run on CI — especially on
// the merge-queue branch where workers contend for CPU. Give them more headroom
// so load-sensitive tests don't flake (and silently drop the PR from the queue).
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
    await fs.promises.appendFile(
      REGISTRY_PATH,
      JSON.stringify(logEntry) + "\n",
    );
  } catch (error) {
    console.error("Failed to write MSW interaction registry entry:", error);
  }
}

const pendingLogs: Promise<void>[] = [];

// Attach listeners immediately to capture traffic in this worker's context
server.events.on("response:mocked", ({ request, response }) => {
  const p = logInteraction(request, response).finally(() => {
    const idx = pendingLogs.indexOf(p);
    if (idx !== -1) pendingLogs.splice(idx, 1);
  });
  pendingLogs.push(p);
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

// jsdom does not implement Element.prototype.scrollIntoView; polyfill as a
// no-op so components that call it during tests (e.g. for keyboard nav) work.
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

// jsdom (29.0.2) does not implement Blob.prototype.stream(). When a test uses
// XHR with `responseType: "blob"`, @mswjs/interceptors wraps the load event in
// `new Response(jsdomBlob, ...)`, and undici's `extractBody` then calls
// `.stream()` on the Blob and throws "object.stream is not a function". The
// rejection is unhandled and (because it propagates out of MSW's `load`
// listener on the same XHR that axios is listening to) can also cause axios
// to receive an error instead of the Blob — making downstream tests flake or
// fail. Polyfill it so the post-load wrapping completes cleanly.
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
