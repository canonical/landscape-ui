import { describe, expect, it, vi } from "vitest";
import { getSentryConfig, renderApp, startApp } from "./main";
import type { createRoot } from "react-dom/client";

describe("main", () => {
  it("starts worker in dev when enabled and renders app", async () => {
    const workerStart = vi.fn();
    const loadWorker = vi.fn(async () => ({
      worker: { start: workerStart },
    }));
    const render = vi.fn();

    await startApp({
      mode: "development",
      isDevEnv: true,
      isMswEnabled: true,
      loadWorker,
      render,
    });

    expect(loadWorker).toHaveBeenCalledTimes(1);
    expect(workerStart).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("does not start worker when msw is disabled", async () => {
    const loadWorker = vi.fn();
    const render = vi.fn();

    await startApp({
      mode: "development",
      isDevEnv: true,
      isMswEnabled: false,
      loadWorker,
      render,
    });

    expect(loadWorker).not.toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("does not start worker when enabled outside dev", async () => {
    const loadWorker = vi.fn();
    const render = vi.fn();

    await startApp({
      mode: "production",
      isDevEnv: false,
      isMswEnabled: true,
      loadWorker,
      render,
    });

    expect(loadWorker).not.toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("does not bootstrap app in test mode", async () => {
    const loadWorker = vi.fn();
    const render = vi.fn();

    await startApp({
      mode: "test",
      isMswEnabled: true,
      loadWorker,
      render,
    });

    expect(loadWorker).not.toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });

  it("renders app root", () => {
    const render = vi.fn();
    const createAppRoot = vi.fn(() => ({ render }));
    const container = document.createElement("div");

    renderApp(createAppRoot as unknown as typeof createRoot, container);

    expect(createAppRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("builds sentry config for fallback release and production", () => {
    const config = getSentryConfig("", false);

    expect(config.release).toBe("local-dev");
    expect(config.environment).toBe("production");
    expect(config.enabled).toBe(true);
  });

  it("builds sentry config for explicit release and development", () => {
    const config = getSentryConfig("1.2.3", true);

    expect(config.release).toBe("1.2.3");
    expect(config.environment).toBe("development");
    expect(config.enabled).toBe(false);
  });
});
