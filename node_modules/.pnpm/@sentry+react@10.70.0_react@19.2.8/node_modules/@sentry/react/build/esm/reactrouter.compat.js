import { createReactRouterV6CompatibleTracingIntegration, createV6CompatibleWrapCreateBrowserRouter, createV6CompatibleWrapCreateMemoryRouter, createV6CompatibleWithSentryReactRouterRouting, createV6CompatibleWrapUseRoutes } from './reactrouter-compat-utils/instrumentation.js';
import '@sentry/core/browser';
import '@sentry/browser';
import '@sentry/core';

function reactRouterBrowserTracingIntegration(options) {
  return createReactRouterV6CompatibleTracingIntegration(options, "");
}
function wrapReactRouterRouting(routes) {
  return createV6CompatibleWithSentryReactRouterRouting(routes, "");
}
function wrapCreateBrowserRouter(createRouterFunction) {
  return createV6CompatibleWrapCreateBrowserRouter(createRouterFunction, "");
}
function wrapCreateMemoryRouter(createMemoryRouterFunction) {
  return createV6CompatibleWrapCreateMemoryRouter(createMemoryRouterFunction, "");
}
function wrapUseRoutes(origUseRoutes) {
  return createV6CompatibleWrapUseRoutes(origUseRoutes, "");
}

export { reactRouterBrowserTracingIntegration, wrapCreateBrowserRouter, wrapCreateMemoryRouter, wrapReactRouterRouting, wrapUseRoutes };
//# sourceMappingURL=reactrouter.compat.js.map
