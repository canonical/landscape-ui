Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const instrumentation = require('./reactrouter-compat-utils/instrumentation.js');
require('@sentry/core/browser');
require('@sentry/browser');
require('@sentry/core');

function reactRouterBrowserTracingIntegration(options) {
  return instrumentation.createReactRouterV6CompatibleTracingIntegration(options, "");
}
function wrapReactRouterRouting(routes) {
  return instrumentation.createV6CompatibleWithSentryReactRouterRouting(routes, "");
}
function wrapCreateBrowserRouter(createRouterFunction) {
  return instrumentation.createV6CompatibleWrapCreateBrowserRouter(createRouterFunction, "");
}
function wrapCreateMemoryRouter(createMemoryRouterFunction) {
  return instrumentation.createV6CompatibleWrapCreateMemoryRouter(createMemoryRouterFunction, "");
}
function wrapUseRoutes(origUseRoutes) {
  return instrumentation.createV6CompatibleWrapUseRoutes(origUseRoutes, "");
}

exports.reactRouterBrowserTracingIntegration = reactRouterBrowserTracingIntegration;
exports.wrapCreateBrowserRouter = wrapCreateBrowserRouter;
exports.wrapCreateMemoryRouter = wrapCreateMemoryRouter;
exports.wrapReactRouterRouting = wrapReactRouterRouting;
exports.wrapUseRoutes = wrapUseRoutes;
//# sourceMappingURL=reactrouter.compat.js.map
