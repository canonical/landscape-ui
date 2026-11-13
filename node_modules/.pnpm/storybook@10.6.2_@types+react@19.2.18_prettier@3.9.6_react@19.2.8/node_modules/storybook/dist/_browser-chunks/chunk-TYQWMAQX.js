import {
  words
} from "./chunk-ZF665KZD.js";

// ../../node_modules/es-toolkit/dist/string/kebabCase.mjs
function kebabCase(str) {
  return words(str).map((word) => word.toLowerCase()).join("-");
}

// src/shared/open-service/toolset-names.ts
function parseToolsetMethodId(methodId) {
  let separator = methodId.indexOf(".");
  if (separator <= 0 || separator !== methodId.lastIndexOf(".") || separator === methodId.length - 1)
    throw new Error(
      `Invalid toolset method id "${methodId}". Expected exactly one separator: toolsetId.methodName.`
    );
  return {
    toolsetId: methodId.slice(0, separator),
    methodName: methodId.slice(separator + 1)
  };
}
function toCliMethodName(methodName) {
  return kebabCase(methodName);
}
function toCliPath(method) {
  let { toolsetId, methodName } = parseToolsetMethodId(method);
  return `${toolsetId} ${toCliMethodName(methodName)}`;
}
function toMcpToolName(method) {
  let { toolsetId, methodName } = parseToolsetMethodId(method);
  return `${kebabCase(toolsetId)}-${toCliMethodName(methodName)}`;
}
function getToolName(context) {
  return (method) => {
    switch (context.transport) {
      case "mcp":
        return toMcpToolName(method);
      case "cli":
        return `npx storybook tools ${toCliPath(method)}`;
      case "sdk":
        return method;
      default:
        return context.transport;
    }
  };
}

export {
  parseToolsetMethodId,
  toCliMethodName,
  toMcpToolName,
  getToolName
};
