import {
  toCliMethodName
} from "./chunk-TYQWMAQX.js";

// src/shared/open-service/toolset-definition.ts
function defineToolset(definition) {
  return definition;
}
function resolveToolsetDescription(description, context) {
  return typeof description == "function" ? description(context) : description;
}
async function invokeToolsetMethod(toolset, methodName, input, context) {
  let { telemetry, ...outcome } = await toolset.methods[methodName].handler(input, context);
  return telemetry ? {
    ...outcome,
    telemetry: {
      ...telemetry,
      toolset: toolset.id,
      tool: toCliMethodName(methodName),
      event: `tool:${toolset.id}_${methodName}`
    }
  } : outcome;
}

export {
  defineToolset,
  resolveToolsetDescription,
  invokeToolsetMethod
};
