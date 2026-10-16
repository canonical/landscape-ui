import CJS_COMPAT_NODE_URL_jivk4nmov18 from 'node:url';
import CJS_COMPAT_NODE_PATH_jivk4nmov18 from 'node:path';
import CJS_COMPAT_NODE_MODULE_jivk4nmov18 from "node:module";

var __filename = CJS_COMPAT_NODE_URL_jivk4nmov18.fileURLToPath(import.meta.url);
var __dirname = CJS_COMPAT_NODE_PATH_jivk4nmov18.dirname(__filename);
var require = CJS_COMPAT_NODE_MODULE_jivk4nmov18.createRequire(import.meta.url);

// ------------------------------------------------------------
// end of CJS compatibility banner, injected by Storybook's esbuild configuration
// ------------------------------------------------------------

// ../../node_modules/slash/index.js
function slash(path) {
  return path.startsWith("\\\\?\\") ? path : path.replace(/\\/g, "/");
}

export {
  slash
};
