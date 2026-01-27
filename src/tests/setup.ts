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
