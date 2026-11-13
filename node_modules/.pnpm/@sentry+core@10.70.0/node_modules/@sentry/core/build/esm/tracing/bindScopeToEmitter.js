import { getCurrentScope, withScope } from '../currentScopes.js';

const ADD_LISTENER_METHODS = [
  "addListener",
  "on",
  "once",
  "prependListener",
  "prependOnceListener",
  "addEventListener"
];
const REMOVE_LISTENER_METHODS = ["removeListener", "off", "removeEventListener"];
const SCOPE_BOUND_LISTENERS = /* @__PURE__ */ Symbol("SentryScopeBoundListeners");
let registeringWrapper;
function isReentrantWrapperRegistration(listener) {
  return registeringWrapper !== void 0 && (listener === registeringWrapper || listener.listener === registeringWrapper);
}
function bindScopeToEmitter(emitter, scope = getCurrentScope()) {
  const ee = emitter;
  if (getPatchMap(ee)) {
    return emitter;
  }
  createPatchMap(ee);
  for (const methodName of ADD_LISTENER_METHODS) {
    if (typeof ee[methodName] !== "function") {
      continue;
    }
    ee[methodName] = patchAddListener(ee, ee[methodName], scope);
  }
  for (const methodName of REMOVE_LISTENER_METHODS) {
    if (typeof ee[methodName] !== "function") {
      continue;
    }
    ee[methodName] = patchRemoveListener(ee, ee[methodName]);
  }
  if (typeof ee.removeAllListeners === "function") {
    ee.removeAllListeners = patchRemoveAllListeners(ee, ee.removeAllListeners);
  }
  return emitter;
}
function bindListenerToScope(listener, scope) {
  return function(...args) {
    return withScope(scope, () => listener.apply(this, args));
  };
}
function isBoundListener(listener) {
  return typeof listener === "function";
}
function patchAddListener(ee, original, scope) {
  return function(...args) {
    const event = args[0];
    const listener = args[1];
    const rest = args.slice(2);
    if (!isBoundListener(listener) || isReentrantWrapperRegistration(listener)) {
      return original.apply(this, args);
    }
    const map = getPatchMap(ee) || createPatchMap(ee);
    let listeners = map.get(event);
    if (!listeners) {
      listeners = /* @__PURE__ */ new WeakMap();
      map.set(event, listeners);
    }
    let boundListener = listeners.get(listener);
    if (!boundListener) {
      boundListener = bindListenerToScope(listener, scope);
      listeners.set(listener, boundListener);
    }
    const previous = registeringWrapper;
    registeringWrapper = boundListener;
    try {
      return original.call(this, event, boundListener, ...rest);
    } finally {
      registeringWrapper = previous;
    }
  };
}
function patchRemoveListener(ee, original) {
  return function(...args) {
    const event = args[0];
    const listener = args[1];
    const rest = args.slice(2);
    const boundListener = isBoundListener(listener) ? getPatchMap(ee)?.get(event)?.get(listener) : void 0;
    if (!boundListener) {
      return original.apply(this, args);
    }
    return original.call(this, event, boundListener, ...rest);
  };
}
function patchRemoveAllListeners(ee, original) {
  return function(...args) {
    const map = getPatchMap(ee);
    if (map) {
      if (args.length === 0) {
        createPatchMap(ee);
      } else {
        const event = args[0];
        map.delete(event);
      }
    }
    return original.apply(this, args);
  };
}
function createPatchMap(ee) {
  const map = /* @__PURE__ */ new Map();
  ee[SCOPE_BOUND_LISTENERS] = map;
  return map;
}
function getPatchMap(ee) {
  return ee[SCOPE_BOUND_LISTENERS];
}

export { bindScopeToEmitter };
//# sourceMappingURL=bindScopeToEmitter.js.map
