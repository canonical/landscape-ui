import { API_URL } from "@/constants";
import type { RequestHandler } from "msw";
import { HttpStatusCode } from "axios";
import server from "./server";

const { setupWorker, onEvent } = vi.hoisted(() => ({
  setupWorker: vi.fn(),
  onEvent: vi.fn(),
}));

vi.mock("msw/browser", () => ({
  setupWorker: (...handlers: RequestHandler[]) => {
    setupWorker(...handlers);
    return { events: { on: onEvent } };
  },
}));

describe("browser activity demo controls", () => {
  beforeEach(async () => {
    sessionStorage.clear();
    vi.resetModules();
    await import("./browser");
    const [handlers] = setupWorker.mock.calls.slice(-1);
    assert(handlers);
    server.use(...handlers);
  });

  afterEach(() => {
    sessionStorage.clear();
    delete window.msw;
    vi.restoreAllMocks();
  });

  it("defaults to populated data and persists each supported scenario", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(vi.fn());
    assert(window.msw);
    const response = await fetch(`${API_URL}activities`);
    expect((await response.json()).count).toBeGreaterThan(0);
    window.msw.setActivityScenario("empty");
    expect(sessionStorage.getItem("msw:activityScenario")).toBe("empty");
    expect(await (await fetch(`${API_URL}activities`)).json()).toMatchObject({
      count: 0,
    });
    window.msw.setActivityScenario("error");
    expect((await fetch(`${API_URL}activities`)).status).toBe(
      HttpStatusCode.InternalServerError,
    );
    window.msw.setActivityScenario("loading");
    expect(sessionStorage.getItem("msw:activityScenario")).toBe("loading");
    window.msw.setActivityScenario("default");
    expect(
      (await (await fetch(`${API_URL}activities`)).json()).count,
    ).toBeGreaterThan(0);
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("reload to apply"),
    );
  });

  it("rejects invalid scenario names and recovers from an invalid stored value", async () => {
    assert(window.msw);
    // @ts-expect-error Invalid console input must fail explicitly at runtime.
    expect(() => window.msw?.setActivityScenario("unknown")).toThrow(
      "Unknown activity scenario",
    );
    sessionStorage.setItem("msw:activityScenario", "unknown");
    expect(
      (await (await fetch(`${API_URL}activities`)).json()).count,
    ).toBeGreaterThan(0);
  });

  it("uses the existing mocks for related computer, USG and export links", async () => {
    for (const path of [
      "computers?limit=1",
      "usg-profiles?limit=1",
      "exports",
    ]) {
      const response = await fetch(`${API_URL}${path}`);
      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(await response.json()).toHaveProperty("results");
    }
  });
});
