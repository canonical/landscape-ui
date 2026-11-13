import * as webStreams from "node:stream/web";

// Under `pool: "vmThreads"` each test file runs in a fresh VM context whose
// globals come from jsdom, not Node, so the WHATWG stream classes that MSW's
// interceptors reference at import time (e.g. `TransformStream`) are missing.
// Copy Node's implementations in before `./setup.ts` imports the MSW server.
// No-op under `pool: "threads"`, where Node already provides them.
const STREAM_GLOBALS = [
  "ReadableStream",
  "WritableStream",
  "TransformStream",
  "TextEncoderStream",
  "TextDecoderStream",
  "CompressionStream",
  "DecompressionStream",
  "ByteLengthQueuingStrategy",
  "CountQueuingStrategy",
] as const;

for (const name of STREAM_GLOBALS) {
  if (typeof globalThis[name] === "undefined") {
    Object.defineProperty(globalThis, name, {
      value: webStreams[name],
      writable: true,
      configurable: true,
    });
  }
}
