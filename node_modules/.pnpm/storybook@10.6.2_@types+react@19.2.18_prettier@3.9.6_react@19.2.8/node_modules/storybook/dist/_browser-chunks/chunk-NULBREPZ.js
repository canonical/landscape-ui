// src/csf/toStartCaseStr.ts
function toStartCaseStr(str) {
  return str.replace(/_/g, " ").replace(/-/g, " ").replace(/\./g, " ").replace(/([^\n])([A-Z])([a-z])/g, (str2, $1, $2, $3) => `${$1} ${$2}${$3}`).replace(/([a-z])([A-Z])/g, (str2, $1, $2) => `${$1} ${$2}`).replace(/([a-z])([0-9])/gi, (str2, $1, $2) => `${$1} ${$2}`).replace(/([0-9])([a-z])/gi, (str2, $1, $2) => `${$1} ${$2}`).replace(/(\s|^)(\w)/g, (str2, $1, $2) => `${$1}${$2.toUpperCase()}`).replace(/ +/g, " ").trim();
}

// src/csf/export-story.ts
function matches(storyKey, arrayOrRegex) {
  return Array.isArray(arrayOrRegex) ? arrayOrRegex.includes(storyKey) : storyKey.match(arrayOrRegex);
}
var storyNameFromExport = (key) => toStartCaseStr(key);
function isExportStory(key, { includeStories, excludeStories }) {
  return (
    // Babel's CommonJS interop adds __esModule; it is not a CSF story export.
    key !== "__esModule" && (!includeStories || matches(key, includeStories)) && (!excludeStories || !matches(key, excludeStories))
  );
}

// src/csf/csf-utils.ts
var sanitize = (string) => string.toLowerCase().replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, ""), sanitizeSafe = (string, part) => {
  let sanitized = sanitize(string);
  if (sanitized === "")
    throw new Error(`Invalid ${part} '${string}', must include alphanumeric characters`);
  return sanitized;
}, toId = (kind, name) => `${sanitizeSafe(kind, "kind")}${name ? `--${sanitizeSafe(name, "name")}` : ""}`, toTestId = (parentId, testName) => `${parentId}:${sanitizeSafe(testName, "test")}`, parseKind = (kind, { rootSeparator, groupSeparator }) => {
  let [root, remainder] = kind.split(rootSeparator, 2), groups = (remainder || kind).split(groupSeparator).filter((i) => !!i);
  return {
    root: remainder ? root : null,
    groups
  };
}, combineTags = (...tags) => {
  let result = tags.reduce((acc, tag) => (tag.startsWith("!") ? acc.delete(tag.slice(1)) : acc.add(tag), acc), /* @__PURE__ */ new Set());
  return Array.from(result);
};

export {
  storyNameFromExport,
  isExportStory,
  sanitize,
  toId,
  toTestId,
  parseKind,
  combineTags
};
