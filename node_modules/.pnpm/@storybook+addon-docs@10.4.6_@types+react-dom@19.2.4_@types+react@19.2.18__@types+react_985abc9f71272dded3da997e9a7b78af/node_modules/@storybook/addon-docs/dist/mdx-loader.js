import CJS_COMPAT_NODE_URL_ugiopc8qmx from 'node:url';
import CJS_COMPAT_NODE_PATH_ugiopc8qmx from 'node:path';
import CJS_COMPAT_NODE_MODULE_ugiopc8qmx from "node:module";

var __filename = CJS_COMPAT_NODE_URL_ugiopc8qmx.fileURLToPath(import.meta.url);
var __dirname = CJS_COMPAT_NODE_PATH_ugiopc8qmx.dirname(__filename);
var require = CJS_COMPAT_NODE_MODULE_ugiopc8qmx.createRequire(import.meta.url);

// ------------------------------------------------------------
// end of CJS compatibility banner, injected by Storybook's esbuild configuration
// ------------------------------------------------------------
import {
  compile
} from "./_node-chunks/chunk-CW3VPTDC.js";
import "./_node-chunks/chunk-3TGPCCME.js";
import "./_node-chunks/chunk-KPMO7MQ3.js";
import "./_node-chunks/chunk-II4NL54B.js";

// src/mdx-loader.ts
var DEFAULT_RENDERER = `
import React from 'react';
`;
async function loader(content) {
  let callback = this.async(), options = { ...this.getOptions(), filepath: this.resourcePath };
  try {
    let result = await compile(content, options), code = `${DEFAULT_RENDERER}
${result}`;
    return callback(null, code);
  } catch (err) {
    return console.error("Error loading:", this.resourcePath), callback(err);
  }
}
var mdx_loader_default = loader;
export {
  mdx_loader_default as default
};
