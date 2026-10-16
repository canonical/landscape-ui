import CJS_COMPAT_NODE_URL_jivk4nmov18 from 'node:url';
import CJS_COMPAT_NODE_PATH_jivk4nmov18 from 'node:path';
import CJS_COMPAT_NODE_MODULE_jivk4nmov18 from "node:module";

var __filename = CJS_COMPAT_NODE_URL_jivk4nmov18.fileURLToPath(import.meta.url);
var __dirname = CJS_COMPAT_NODE_PATH_jivk4nmov18.dirname(__filename);
var require = CJS_COMPAT_NODE_MODULE_jivk4nmov18.createRequire(import.meta.url);

// ------------------------------------------------------------
// end of CJS compatibility banner, injected by Storybook's esbuild configuration
// ------------------------------------------------------------

// src/common/versions.ts
var versions_default = {
  "@storybook/addon-a11y": "10.4.6",
  "@storybook/addon-docs": "10.4.6",
  "@storybook/addon-links": "10.4.6",
  "@storybook/addon-onboarding": "10.4.6",
  "storybook-addon-pseudo-states": "10.4.6",
  "@storybook/addon-themes": "10.4.6",
  "@storybook/addon-vitest": "10.4.6",
  "@storybook/builder-vite": "10.4.6",
  "@storybook/builder-webpack5": "10.4.6",
  storybook: "10.4.6",
  "@storybook/angular": "10.4.6",
  "@storybook/ember": "10.4.6",
  "@storybook/html-vite": "10.4.6",
  "@storybook/nextjs": "10.4.6",
  "@storybook/nextjs-vite": "10.4.6",
  "@storybook/preact-vite": "10.4.6",
  "@storybook/react-native-web-vite": "10.4.6",
  "@storybook/react-vite": "10.4.6",
  "@storybook/react-webpack5": "10.4.6",
  "@storybook/server-webpack5": "10.4.6",
  "@storybook/svelte-vite": "10.4.6",
  "@storybook/sveltekit": "10.4.6",
  "@storybook/tanstack-react": "10.4.6",
  "@storybook/vue3-vite": "10.4.6",
  "@storybook/web-components-vite": "10.4.6",
  sb: "10.4.6",
  "@storybook/cli": "10.4.6",
  "@storybook/codemod": "10.4.6",
  "@storybook/core-webpack": "10.4.6",
  "create-storybook": "10.4.6",
  "@storybook/csf-plugin": "10.4.6",
  "eslint-plugin-storybook": "10.4.6",
  "@storybook/react-dom-shim": "10.4.6",
  "@storybook/preset-create-react-app": "10.4.6",
  "@storybook/preset-react-webpack": "10.4.6",
  "@storybook/preset-server-webpack": "10.4.6",
  "@storybook/html": "10.4.6",
  "@storybook/preact": "10.4.6",
  "@storybook/react": "10.4.6",
  "@storybook/server": "10.4.6",
  "@storybook/svelte": "10.4.6",
  "@storybook/vue3": "10.4.6",
  "@storybook/web-components": "10.4.6"
};

// src/common/node-version.ts
import { satisfies } from "semver";
var MIN_SUPPORTED_NODE_VERSIONS = [
  { major: 20, minor: 19, patch: 0 },
  { major: 22, minor: 12, patch: 0 }
];
function formatMinVersion(v) {
  return v.minor === 0 && v.patch === 0 ? `${v.major}+` : v.patch === 0 ? `${v.major}.${v.minor}+` : `${v.major}.${v.minor}.${v.patch}+`;
}
var MIN_SUPPORTED_NODE_DESCRIPTION = MIN_SUPPORTED_NODE_VERSIONS.map(formatMinVersion).join(" or ");
function isNodeVersionSupported(major, minor, patch) {
  let sortedMinimums = [...MIN_SUPPORTED_NODE_VERSIONS].sort((a, b) => a.major - b.major), supportedRange = sortedMinimums.map((min, index) => {
    let next = sortedMinimums[index + 1], lowerBound = `>=${min.major}.${min.minor}.${min.patch}`;
    return next ? `${lowerBound} <${next.major}.0.0` : lowerBound;
  }).join(" || ");
  return satisfies(`${major}.${minor}.${patch}`, supportedRange);
}

export {
  versions_default,
  MIN_SUPPORTED_NODE_VERSIONS,
  formatMinVersion,
  MIN_SUPPORTED_NODE_DESCRIPTION,
  isNodeVersionSupported
};
