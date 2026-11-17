Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const browser = require('@sentry/browser');
const browser$1 = require('@sentry/core/browser');
const attributes = require('@sentry/conventions/attributes');

function tanstackRouterBrowserTracingIntegration(router, options = {}) {
  const castRouterInstance = router;
  const browserTracingIntegrationInstance = browser.browserTracingIntegration({
    ...options,
    instrumentNavigation: false,
    instrumentPageLoad: false
  });
  const { instrumentPageLoad = true, instrumentNavigation = true } = options;
  return {
    ...browserTracingIntegrationInstance,
    afterAllSetup(client) {
      browserTracingIntegrationInstance.afterAllSetup(client);
      const resolveRouteMatch = (pathname, search) => {
        const matchedRoutes = castRouterInstance.matchRoutes(pathname, search, {
          preload: false,
          throwOnError: false
        });
        const lastMatch = matchedRoutes[matchedRoutes.length - 1];
        return lastMatch?.routeId !== "__root__" ? lastMatch : void 0;
      };
      const applyRouteMatch = (span, match, toLocation, fallbackName) => {
        span.updateName(match ? match.routeId : fallbackName);
        span.setAttribute(browser$1.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, match ? "route" : "url");
        span.setAttributes({
          ...match && { [attributes.URL_TEMPLATE]: match.routeId },
          ...locationToSpanUrlAttributes(castRouterInstance, toLocation),
          ...routeMatchToParamSpanAttributes(match)
        });
      };
      const initialWindowLocation = browser.WINDOW.location;
      if (instrumentPageLoad && initialWindowLocation) {
        const routeMatch = resolveRouteMatch(
          initialWindowLocation.pathname,
          castRouterInstance.options.parseSearch(initialWindowLocation.search)
        );
        const pageloadSpan = browser.startBrowserTracingPageLoadSpan(client, {
          name: routeMatch ? routeMatch.routeId : initialWindowLocation.pathname,
          attributes: {
            [browser$1.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "pageload",
            [browser$1.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.pageload.react.tanstack_router",
            [browser$1.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: routeMatch ? "route" : "url",
            ...routeMatch && { [attributes.URL_TEMPLATE]: routeMatch.routeId },
            ...routeMatchToParamSpanAttributes(routeMatch)
          }
        });
        const unsubscribePageloadResolved = castRouterInstance.subscribe("onResolved", (onResolvedArgs) => {
          unsubscribePageloadResolved();
          if (!pageloadSpan) {
            return;
          }
          const { toLocation } = onResolvedArgs;
          const resolvedMatch = resolveRouteMatch(toLocation.pathname, toLocation.search);
          applyRouteMatch(pageloadSpan, resolvedMatch, toLocation, toLocation.pathname);
        });
      }
      if (instrumentNavigation) {
        let inFlightNavigationSpan;
        castRouterInstance.subscribe("onBeforeLoad", (onBeforeLoadArgs) => {
          const { toLocation, fromLocation } = onBeforeLoadArgs;
          if (!fromLocation || toLocation.state === fromLocation.state) {
            return;
          }
          const routeMatch = resolveRouteMatch(toLocation.pathname, toLocation.search);
          const fallbackName = browser.WINDOW.location?.pathname || toLocation.pathname;
          if (inFlightNavigationSpan) {
            applyRouteMatch(inFlightNavigationSpan, routeMatch, toLocation, fallbackName);
            return;
          }
          inFlightNavigationSpan = browser.startBrowserTracingNavigationSpan(
            client,
            {
              name: routeMatch ? routeMatch.routeId : fallbackName,
              attributes: {
                [browser$1.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "navigation",
                [browser$1.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.navigation.react.tanstack_router",
                [browser$1.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: routeMatch ? "route" : "url",
                ...routeMatch && { [attributes.URL_TEMPLATE]: routeMatch.routeId },
                ...routeMatchToParamSpanAttributes(routeMatch)
              }
            },
            { url: locationToAbsoluteUrl(castRouterInstance, toLocation) }
          );
        });
        castRouterInstance.subscribe("onResolved", (onResolvedArgs) => {
          const span = inFlightNavigationSpan;
          inFlightNavigationSpan = void 0;
          if (!span) {
            return;
          }
          const { toLocation } = onResolvedArgs;
          const resolvedMatch = resolveRouteMatch(toLocation.pathname, toLocation.search);
          if (resolvedMatch) {
            applyRouteMatch(span, resolvedMatch, toLocation, browser.WINDOW.location?.pathname || toLocation.pathname);
          }
        });
      }
    }
  };
}
function locationToAbsoluteUrl(router, location) {
  const search = router.options.stringifySearch?.(location.search) ?? "";
  const pathWithSearch = `${location.pathname}${search && search !== "?" ? search : ""}`;
  return browser.getAbsoluteUrl(pathWithSearch);
}
function locationToSpanUrlAttributes(router, location) {
  const absoluteUrl = locationToAbsoluteUrl(router, location);
  return {
    [attributes.URL_PATH]: location.pathname,
    [attributes.URL_FULL]: absoluteUrl
  };
}
function routeMatchToParamSpanAttributes(match) {
  if (!match) {
    return {};
  }
  const paramAttributes = {};
  Object.entries(match.params).forEach(([key, value]) => {
    paramAttributes[`url.path.params.${key}`] = value;
    paramAttributes[`${attributes.URL_PATH_PARAMETER_KEY_BASE}.${key}`] = value;
    paramAttributes[`${attributes.PARAMS_KEY_BASE}.${key}`] = value;
  });
  return paramAttributes;
}

exports.tanstackRouterBrowserTracingIntegration = tanstackRouterBrowserTracingIntegration;
//# sourceMappingURL=tanstackrouter.js.map
