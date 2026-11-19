import * as webStreams from "node:stream/web";

// Under vmThreads each file gets jsdom globals, which lack the WHATWG stream
// classes (e.g. `TransformStream`) that MSW needs at import time. Copy Node's
// in before `./setup.ts` loads MSW. No-op under `threads`.
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
