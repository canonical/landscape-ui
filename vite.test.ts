import { EventEmitter } from "events";
import fs from "fs";
import type { PathLike, ReadStream, Stats } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import * as path from "path";
import type { ResolvedConfig, ViteDevServer } from "vite";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPragmaIconsPlugin, getPragmaIconPath } from "./vite.config";

type Middleware = (
  request: Pick<IncomingMessage, "url">,
  response: Pick<ServerResponse, "destroy" | "headersSent" | "setHeader">,
  next: (error?: unknown) => void,
) => void;

const registerPluginMiddleware = () => {
  let middleware: Middleware | undefined;
  const warn = vi.fn();
  const server = {
    config: { logger: { warn } },
    middlewares: {
      use: vi.fn((registeredMiddleware: Middleware) => {
        middleware = registeredMiddleware;
      }),
    },
  } as unknown as ViteDevServer;
  const configureServer = createPragmaIconsPlugin().configureServer as (
    server: ViteDevServer,
  ) => void;

  configureServer(server);

  if (!middleware) {
    throw new Error("Pragma icon middleware was not registered");
  }

  return { middleware, warn };
};

describe("createPragmaIconsPlugin", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(["/icons/%2e%2e%2fsecret.svg", "/icons/%2Fetc%2Fpasswd", "/icons/%"])(
    "rejects unsafe decoded icon path %s",
    (requestUrl) => {
      expect(getPragmaIconPath(requestUrl, ["/icons/"])).toBeNull();
    },
  );

  it("passes missing icons to the next middleware", async () => {
    const { middleware } = registerPluginMiddleware();
    const next = vi.fn();

    middleware(
      { url: "/icons/this-icon-does-not-exist.svg" },
      {} as Pick<ServerResponse, "destroy" | "headersSent" | "setHeader">,
      next,
    );

    await vi.waitFor(() => {
      expect(next).toHaveBeenCalledOnce();
    });
  });

  it("logs stream failures after response headers are sent", () => {
    const streamError = new Error("read failed");
    const iconStream = Object.assign(new EventEmitter(), {
      pipe: vi.fn(),
    }) as unknown as ReadStream;
    vi.spyOn(fs, "stat").mockImplementation(((
      _filePath: PathLike,
      callback: (error: NodeJS.ErrnoException | null, stats: Stats) => void,
    ) => {
      callback(null, { isFile: () => true } as Stats);
    }) as unknown as typeof fs.stat);
    vi.spyOn(fs, "createReadStream").mockReturnValue(iconStream);
    const { middleware, warn } = registerPluginMiddleware();
    const response = {
      destroy: vi.fn(),
      headersSent: true,
      setHeader: vi.fn(),
    };

    middleware({ url: "/icons/status.svg" }, response, vi.fn());
    iconStream.emit("error", streamError);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Failed to serve Pragma icon"),
    );
    expect(response.destroy).toHaveBeenCalledWith(streamError);
  });

  it("copies icons to the configured build directory", () => {
    const root = "/tmp/landscape-ui";
    const outDir = "build";
    const copy = vi.spyOn(fs, "cpSync").mockImplementation(() => undefined);
    const plugin = createPragmaIconsPlugin();
    const configResolved = plugin.configResolved as (
      config: ResolvedConfig,
    ) => void;
    const writeBundle = plugin.writeBundle as () => void;

    configResolved({ root, build: { outDir } } as ResolvedConfig);
    writeBundle();

    expect(copy).toHaveBeenCalledWith(
      expect.any(String),
      path.resolve(root, outDir, "icons"),
      { force: true, recursive: true },
    );
  });
});
