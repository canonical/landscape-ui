import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "./matcher";
import "./global";
import server from "./server";
import { setEndpointStatus } from "./controllers/controller";

expect.extend(matchers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  setEndpointStatus("default");
  server.resetHandlers();
  cleanup();
});
