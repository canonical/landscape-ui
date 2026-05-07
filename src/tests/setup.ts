import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { setEndpointStatus } from "./controllers/controller";
import {
  mockRangeBoundingClientRect,
  resetScreenSize,
  restoreRangeBoundingClientRect,
} from "./helpers";
import "./matcher";
import server from "./server";

expect.extend(matchers);

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

afterAll(() => {
  server.close();
  restoreRangeBoundingClientRect();
});

afterEach(() => {
  setEndpointStatus("default");
  server.resetHandlers();
  cleanup();
  resetScreenSize();
});
