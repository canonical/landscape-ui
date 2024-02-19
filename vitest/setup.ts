/// <reference types="vitest" />

import "@testing-library/jest-dom";
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "./matcher";
import "./global";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
