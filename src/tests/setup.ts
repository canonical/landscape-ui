import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { setEndpointStatus } from "./controllers/controller";
import "./global";
import {
  mockRangeBoundingClientRect,
  restoreRangeBoundingClientRect,
} from "./helpers";
import "./matcher";
import server from "./server";

expect.extend(matchers);

const ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserver);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  mockRangeBoundingClientRect();
});

afterAll(() => {
  server.close();
  restoreRangeBoundingClientRect();
});

afterEach(() => {
  setEndpointStatus("default");
  server.resetHandlers();
  cleanup();
});
