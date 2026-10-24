import {
  defineToolset,
  invokeToolsetMethod,
  resolveToolsetDescription
} from "../../_browser-chunks/chunk-WYNCY4CL.js";
import {
  getToolName,
  parseToolsetMethodId,
  toCliMethodName,
  toMcpToolName
} from "../../_browser-chunks/chunk-TYQWMAQX.js";
import {
  defineService
} from "../../_browser-chunks/chunk-ZEHRUHTA.js";
import {
  prependImportToSnippet,
  selectSnippetForStory,
  selectStoryDoc,
  selectWarningForStory
} from "../../_browser-chunks/chunk-SZYFOQMT.js";
import {
  seedQueryState
} from "../../_browser-chunks/chunk-QC4HFS6K.js";
import {
  OpenServiceDuplicateToolNameError,
  OpenServiceDuplicateToolsetError,
  OpenServiceInvalidToolsetMethodIdError,
  OpenServiceMissingToolsetError
} from "../../_browser-chunks/chunk-3PFG54GG.js";
import "../../_browser-chunks/chunk-ZF665KZD.js";
import "../../_browser-chunks/chunk-LKJ5WGKT.js";
import "../../_browser-chunks/chunk-SC67XZST.js";
import "../../_browser-chunks/chunk-3LY4VQVK.js";
import "../../_browser-chunks/chunk-IMSF75WX.js";

// src/shared/open-service/toolset-registry.ts
var TOOLSET_REGISTRY_SYMBOL = /* @__PURE__ */ Symbol.for("storybook.open-service.toolset-registry");
function getToolsetRegistry() {
  let registryGlobal = globalThis;
  return registryGlobal[TOOLSET_REGISTRY_SYMBOL] ??= /* @__PURE__ */ new Map(), registryGlobal[TOOLSET_REGISTRY_SYMBOL];
}
function assertNoDerivedNameCollisions(toolset) {
  let registry = getToolsetRegistry(), cliNames = /* @__PURE__ */ new Map();
  for (let methodName of Object.keys(toolset.methods)) {
    if (!methodName || methodName.includes("."))
      throw new OpenServiceInvalidToolsetMethodIdError({
        methodId: `${toolset.id}.${methodName}`
      });
    let cliName = toCliMethodName(methodName), priorCli = cliNames.get(cliName);
    if (priorCli)
      throw new OpenServiceDuplicateToolNameError({
        derivedName: cliName,
        first: `${toolset.id}.${priorCli}`,
        second: `${toolset.id}.${methodName}`,
        transport: "cli"
      });
    cliNames.set(cliName, methodName);
    let methodId = `${toolset.id}.${methodName}`, mcpName;
    try {
      mcpName = toMcpToolName(methodId);
    } catch {
      throw new OpenServiceInvalidToolsetMethodIdError({ methodId });
    }
    for (let [existingId, existing] of registry)
      for (let existingMethod of Object.keys(existing.methods)) {
        let existingMethodId = `${existingId}.${existingMethod}`;
        if (toMcpToolName(existingMethodId) === mcpName)
          throw new OpenServiceDuplicateToolNameError({
            derivedName: mcpName,
            first: existingMethodId,
            second: methodId,
            transport: "mcp"
          });
      }
  }
}
function registerToolset(toolset) {
  let registry = getToolsetRegistry();
  if (registry.has(toolset.id))
    throw new OpenServiceDuplicateToolsetError({ toolsetId: toolset.id });
  assertNoDerivedNameCollisions(toolset), registry.set(toolset.id, toolset);
}
function getToolset(toolsetId) {
  let toolset = getToolsetRegistry().get(toolsetId);
  if (!toolset)
    throw new OpenServiceMissingToolsetError({ toolsetId });
  return toolset;
}
function getRegisteredToolsets() {
  return [...getToolsetRegistry().values()];
}
function clearToolsetRegistry() {
  getToolsetRegistry().clear();
}
export {
  OpenServiceDuplicateToolNameError,
  OpenServiceDuplicateToolsetError,
  OpenServiceInvalidToolsetMethodIdError,
  OpenServiceMissingToolsetError,
  clearToolsetRegistry,
  defineService,
  defineToolset,
  getRegisteredToolsets,
  getToolName,
  getToolset,
  invokeToolsetMethod,
  parseToolsetMethodId,
  prependImportToSnippet,
  registerToolset,
  resolveToolsetDescription,
  seedQueryState,
  selectSnippetForStory,
  selectStoryDoc,
  selectWarningForStory,
  toMcpToolName
};
