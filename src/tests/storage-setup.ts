import { vi } from "vitest";

vi.stubGlobal("localStorage", jsdom.window.localStorage);
vi.stubGlobal("sessionStorage", jsdom.window.sessionStorage);
