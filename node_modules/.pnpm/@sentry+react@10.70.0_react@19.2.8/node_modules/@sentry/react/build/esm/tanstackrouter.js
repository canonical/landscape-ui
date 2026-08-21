import { browserTracingIntegration, WINDOW, startBrowserTracingPageLoadSpan, startBrowserTracingNavigationSpan, getAbsoluteUrl } from '@sentry/browser';
import { SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_OP } from '@sentry/core/browser';
import { URL_TEMPLATE, URL_PATH_PARAMETER_KEY_BASE, PARAMS_KEY_BASE, URL_FULL, URL_PATH } from '@sentry/conventions/attributes';

function tanstackRouterBrowserTracingIntegration(router, options = {}) {
  const castRouterInstance = router;
  const browserTracingIntegrationInstance = browserTracingIntegration({
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
        span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, match ? "route" : "url");
        span.setAttributes({
          ...match && { [URL_TEMPLATE]: match.routeId },
          ...locationToSpanUrlAttributes(castRouterInstance, toLocation),
          ...routeMatchToParamSpanAttributes(match)
        });
      };
      const initialWindowLocation = WINDOW.location;
      if (instrumentPageLoad && initialWindowLocation) {
        const routeMatch = resolveRouteMatch(
          initialWindowLocation.pathname,
          castRouterInstance.options.parseSearch(initialWindowLocation.search)
        );
        const pageloadSpan = startBrowserTracingPageLoadSpan(client, {
          name: routeMatch ? routeMatch.routeId : initialWindowLocation.pathname,
          attributes: {
            [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "pageload",
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.pageload.react.tanstack_router",
            [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: routeMatch ? "route" : "url",
            ...routeMatch && { [URL_TEMPLATE]: routeMatch.routeId },
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
          const fallbackName = WINDOW.location?.pathname || toLocation.pathname;
          if (inFlightNavigationSpan) {
            applyRouteMatch(inFlightNavigationSpan, routeMatch, toLocation, fallbackName);
            return;
          }
          inFlightNavigationSpan = startBrowserTracingNavigationSpan(
            client,
            {
              name: routeMatch ? routeMatch.routeId : fallbackName,
              attributes: {
                [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "navigation",
                [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.navigation.react.tanstack_router",
                [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: routeMatch ? "route" : "url",
                ...routeMatch && { [URL_TEMPLATE]: routeMatch.routeId },
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
            applyRouteMatch(span, resolvedMatch, toLocation, WINDOW.location?.pathname || toLocation.pathname);
          }
        });
      }
    }
  };
}
function locationToAbsoluteUrl(router, location) {
  const search = router.options.stringifySearch?.(location.search) ?? "";
  const pathWithSearch = `${location.pathname}${search && search !== "?" ? search : ""}`;
  return getAbsoluteUrl(pathWithSearch);
}
function locationToSpanUrlAttributes(router, location) {
  const absoluteUrl = locationToAbsoluteUrl(router, location);
  return {
    [URL_PATH]: location.pathname,
    [URL_FULL]: absoluteUrl
  };
}
function routeMatchToParamSpanAttributes(match) {
  if (!match) {
    return {};
  }
  const paramAttributes = {};
  Object.entries(match.params).forEach(([key, value]) => {
    paramAttributes[`url.path.params.${key}`] = value;
    paramAttributes[`${URL_PATH_PARAMETER_KEY_BASE}.${key}`] = value;
    paramAttributes[`${PARAMS_KEY_BASE}.${key}`] = value;
  });
  return paramAttributes;
}

export { tanstackRouterBrowserTracingIntegration };
//# sourceMappingURL=tanstackrouter.js.map
