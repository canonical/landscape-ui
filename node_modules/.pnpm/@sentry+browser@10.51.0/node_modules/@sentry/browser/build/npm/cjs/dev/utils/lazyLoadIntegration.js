Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const helpers = require('../helpers.js');

// Single source of truth: as const array provides both the runtime list and the type.
// Bundle file names are derived: strip 'Integration' suffix, lowercase.
// Exceptions (hyphenated bundle names) are listed in HYPHENATED_BUNDLES.
const LAZY_LOADABLE_NAMES = [
  'replayIntegration',
  'replayCanvasIntegration',
  'feedbackIntegration',
  'feedbackModalIntegration',
  'feedbackScreenshotIntegration',
  'captureConsoleIntegration',
  'contextLinesIntegration',
  'linkedErrorsIntegration',
  'dedupeIntegration',
  'extraErrorDataIntegration',
  'graphqlClientIntegration',
  'httpClientIntegration',
  'reportingObserverIntegration',
  'rewriteFramesIntegration',
  'browserProfilingIntegration',
  'moduleMetadataIntegration',
  'instrumentAnthropicAiClient',
  'instrumentOpenAiClient',
  'instrumentGoogleGenAIClient',
  'instrumentLangGraph',
  'createLangChainCallbackHandler',
  'instrumentLangChainEmbeddings',
] ;

const HYPHENATED_BUNDLES = {
  replayCanvasIntegration: 'replay-canvas',
  feedbackModalIntegration: 'feedback-modal',
  feedbackScreenshotIntegration: 'feedback-screenshot',
};

function getBundleName(name) {
  return HYPHENATED_BUNDLES[name ] || name.replace('Integration', '').toLowerCase();
}

const WindowWithMaybeIntegration = helpers.WINDOW

;

/**
 * Lazy load an integration from the CDN.
 * Rejects if the integration cannot be loaded.
 */
async function lazyLoadIntegration(
  name,
  scriptNonce,
) {
  const bundle = LAZY_LOADABLE_NAMES.includes(name) ? getBundleName(name) : undefined;

  // `window.Sentry` is only set when using a CDN bundle, but this method can also be used via the NPM package
  const sentryOnWindow = (WindowWithMaybeIntegration.Sentry = WindowWithMaybeIntegration.Sentry || {});

  if (!bundle) {
    throw new Error(`Cannot lazy load integration: ${name}`);
  }

  // Bail if the integration already exists
  const existing = sentryOnWindow[name];
  // The `feedbackIntegration` is loaded by default in the CDN bundles,
  // so we need to differentiate between the real integration and the shim.
  // if only the shim exists, we still want to lazy load the real integration.
  if (typeof existing === 'function' && !('_isShim' in existing)) {
    return existing;
  }

  const url = getScriptURL(bundle);
  const script = helpers.WINDOW.document.createElement('script');
  script.src = url;
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'strict-origin';

  if (scriptNonce) {
    script.setAttribute('nonce', scriptNonce);
  }

  const waitForLoad = new Promise((resolve, reject) => {
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', reject);
  });

  const currentScript = helpers.WINDOW.document.currentScript;
  const parent = helpers.WINDOW.document.body || helpers.WINDOW.document.head || currentScript?.parentElement;

  if (parent) {
    parent.appendChild(script);
  } else {
    throw new Error(`Could not find parent element to insert lazy-loaded ${name} script`);
  }

  try {
    await waitForLoad;
  } catch {
    throw new Error(`Error when loading integration: ${name}`);
  }

  const integrationFn = sentryOnWindow[name];

  if (typeof integrationFn !== 'function') {
    throw new Error(`Could not load integration: ${name}`);
  }

  return integrationFn;
}

function getScriptURL(bundle) {
  const client = core.getClient();
  const baseURL = client?.getOptions()?.cdnBaseUrl || 'https://browser.sentry-cdn.com';

  return new URL(`/${core.SDK_VERSION}/${bundle}.min.js`, baseURL).toString();
}

exports.lazyLoadIntegration = lazyLoadIntegration;
//# sourceMappingURL=lazyLoadIntegration.js.map
