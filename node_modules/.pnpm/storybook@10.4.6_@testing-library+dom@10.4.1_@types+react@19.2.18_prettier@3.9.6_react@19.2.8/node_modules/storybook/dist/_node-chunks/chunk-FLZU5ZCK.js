import CJS_COMPAT_NODE_URL_jivk4nmov18 from 'node:url';
import CJS_COMPAT_NODE_PATH_jivk4nmov18 from 'node:path';
import CJS_COMPAT_NODE_MODULE_jivk4nmov18 from "node:module";

var __filename = CJS_COMPAT_NODE_URL_jivk4nmov18.fileURLToPath(import.meta.url);
var __dirname = CJS_COMPAT_NODE_PATH_jivk4nmov18.dirname(__filename);
var require = CJS_COMPAT_NODE_MODULE_jivk4nmov18.createRequire(import.meta.url);

// ------------------------------------------------------------
// end of CJS compatibility banner, injected by Storybook's esbuild configuration
// ------------------------------------------------------------

// src/common/utils/utils.ts
var groupBy = (items, keySelector) => items.reduce(
  (acc, item, index) => {
    let key = keySelector(item, index);
    return acc[key] ??= [], acc[key].push(item), acc;
  },
  {}
);
function invariant(condition, message) {
  if (!condition)
    throw new Error((typeof message == "function" ? message() : message) ?? "Invariant failed");
}

export {
  groupBy,
  invariant
};
