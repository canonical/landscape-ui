import {
  StorybookError
} from "./chunk-LKJ5WGKT.js";
import {
  require_picocolors_browser
} from "./chunk-SC67XZST.js";
import {
  __toESM
} from "./chunk-IMSF75WX.js";

// src/server-errors.ts
var import_picocolors = __toESM(require_picocolors_browser(), 1);

// src/shared/open-service/errors.ts
function formatIssuePath(path) {
  return path?.length ? path.map((segment) => {
    let key = typeof segment == "object" && segment !== null && "key" in segment ? segment.key : segment;
    return typeof key == "number" ? `[${key}]` : `.${String(key)}`;
  }).join("").replace(/^\./, "") : "";
}
function formatIssues(issues) {
  return issues.map((issue) => {
    let path = formatIssuePath(issue.path);
    return path === "" ? issue.message : `${path}: ${issue.message}`;
  }).join(`
`);
}

// src/server-errors.ts
var OpenServiceValidationError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceValidationError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 5,
      message: `Invalid ${data.phase} for ${data.kind} "${data.serviceId}.${data.name}":
${formatIssues(
        data.issues
      )}`
    });
    this.data = data;
  }
};
var OpenServiceMissingServiceError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceMissingServiceError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 7,
      message: `No registered service with id "${data.serviceId}" exists in this environment.`
    });
    this.data = data;
  }
}, OpenServiceInternalServiceError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceInternalServiceError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 19,
      message: `Service "${data.serviceId}" is internal. Pass { internal: true } to getService() only if you intentionally depend on an unstable OSA surface. Internal services may change without notice.`
    });
    this.data = data;
  }
}, OpenServiceUnimplementedOperationError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceUnimplementedOperationError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 8,
      message: `${data.kind[0].toUpperCase()}${data.kind.slice(1)} "${data.serviceId}.${data.name}" is not implemented for this environment.`
    });
    this.data = data;
  }
}, OpenServiceInvalidStaticPathError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceInvalidStaticPathError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 10,
      message: `Invalid static path "${data.path}" for query "${data.serviceId}.${data.name}": use a relative path with forward slashes and no ".." segments.`
    });
    this.data = data;
  }
}, OpenServiceAsyncSchemaError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceAsyncSchemaError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 9,
      message: `Async schema for ${data.kind} "${data.serviceId}.${data.name}" (${data.phase}): query input and output schemas must validate synchronously.`
    });
    this.data = data;
  }
}, OpenServiceLoadedDrainExceededError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceLoadedDrainExceededError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 11,
      message: `Query "${data.serviceId}.${data.name}".loaded(...) did not settle after ${data.iterations} drain iterations. Check for handlers that keep discovering new dependencies after every state change.`
    });
    this.data = data;
  }
};
var OpenServiceMissingChannelError = class extends StorybookError {
  constructor(data = {}) {
    super({
      name: "OpenServiceMissingChannelError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 13,
      message: data.serviceId ? `Cannot register service "${data.serviceId}": the Storybook addons channel is not installed in this runtime.` : "The Storybook addons channel is not installed in this runtime."
    });
    this.data = data;
  }
}, OpenServiceRemoteCommandDisconnectedError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceRemoteCommandDisconnectedError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 14,
      message: `Service "${data.serviceId}" was unregistered before a remote command resolved.`
    });
    this.data = data;
  }
}, OpenServiceRemoteCommandUnhandledError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceRemoteCommandUnhandledError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 15,
      message: data.delegated ? `The Storybook this runtime is attached to did not acknowledge remote command "${data.serviceId}.${data.commandName}" in time \u2014 it may be busy or unreachable. Retry; note the command may still have executed on that instance.` : `No runtime acknowledged remote command "${data.serviceId}.${data.commandName}"; its handler is not implemented in any connected runtime.`
    });
    this.data = data;
  }
}, OpenServiceRemoteCommandConfigDriftError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceRemoteCommandConfigDriftError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 30,
      message: `The Storybook this runtime is attached to reported it has no handler for remote command "${data.serviceId}.${data.commandName}". The two processes are running different configurations (for example a feature flag enabled in one but not the other). Restart the attached Storybook with a configuration matching this process.`
    });
    this.data = data;
  }
}, OpenServiceOperationNameCollisionError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceOperationNameCollisionError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 16,
      message: `Service "${data.serviceId}" cannot register "${data.operationName}" as both a query and a command.`
    });
    this.data = data;
  }
};
var OpenServiceMissingToolsetError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceMissingToolsetError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 23,
      message: `No registered toolset with id "${data.toolsetId}" exists in this environment.`
    });
    this.data = data;
  }
}, OpenServiceDuplicateToolsetError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceDuplicateToolsetError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 24,
      message: `A toolset with id "${data.toolsetId}" is already registered. Each public toolset must be registered exactly once.`
    });
    this.data = data;
  }
};
var OpenServiceInvalidToolsetMethodIdError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceInvalidToolsetMethodIdError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 28,
      message: `Invalid toolset method id "${data.methodId}". Expected exactly one separator: toolsetId.methodName.`
    });
    this.data = data;
  }
}, OpenServiceDuplicateToolNameError = class extends StorybookError {
  constructor(data) {
    super({
      name: "OpenServiceDuplicateToolNameError",
      category: "CORE-COMMON" /* CORE_COMMON */,
      code: 29,
      message: data.transport === "mcp" ? `Derived MCP tool name "${data.derivedName}" collides between "${data.first}" and "${data.second}". Rename one toolset id or method key.` : `Derived CLI method name "${data.derivedName}" collides between "${data.first}" and "${data.second}" in the same toolset. Rename one method key.`
    });
    this.data = data;
  }
};
var StatusTypeIdMismatchError = class extends StorybookError {
  constructor(data) {
    super({
      name: "StatusTypeIdMismatchError",
      category: "CORE-SERVER" /* CORE_SERVER */,
      code: 16,
      message: `Status has typeId "${data.status.typeId}" but was added to store with typeId "${data.typeId}". Full status: ${JSON.stringify(
        data.status,
        null,
        2
      )}`
    });
    this.data = data;
  }
};

export {
  OpenServiceValidationError,
  OpenServiceMissingServiceError,
  OpenServiceInternalServiceError,
  OpenServiceUnimplementedOperationError,
  OpenServiceInvalidStaticPathError,
  OpenServiceAsyncSchemaError,
  OpenServiceLoadedDrainExceededError,
  OpenServiceMissingChannelError,
  OpenServiceRemoteCommandDisconnectedError,
  OpenServiceRemoteCommandUnhandledError,
  OpenServiceRemoteCommandConfigDriftError,
  OpenServiceOperationNameCollisionError,
  OpenServiceMissingToolsetError,
  OpenServiceDuplicateToolsetError,
  OpenServiceInvalidToolsetMethodIdError,
  OpenServiceDuplicateToolNameError,
  StatusTypeIdMismatchError
};
