Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const filteringSnippets = require('./filtering-snippets.js');

function defaultPiiToCollectionOptions(sendDefaultPii) {
  return sendDefaultPii === true ? {
    userInfo: true,
    cookies: true,
    httpHeaders: { request: true, response: true },
    httpBodies: ["incomingRequest", "outgoingRequest", "incomingResponse", "outgoingResponse"],
    urlQueryParams: true,
    graphQL: { document: true, variables: true },
    genAI: { inputs: true, outputs: true },
    databaseQueryData: true,
    stackFrameVariables: true,
    frameContextLines: 7
    // default should be 5, but ContextLines integration uses 7
  } : {
    userInfo: false,
    cookies: { deny: filteringSnippets.PII_HEADER_SNIPPETS },
    httpHeaders: { request: { deny: filteringSnippets.PII_HEADER_SNIPPETS }, response: { deny: filteringSnippets.PII_HEADER_SNIPPETS } },
    httpBodies: [],
    urlQueryParams: { deny: filteringSnippets.PII_HEADER_SNIPPETS },
    // The GraphQL document has literal values redacted at collection time, so it was historically
    // always attached regardless of `sendDefaultPii`; keep it on to preserve that behavior.
    graphQL: { document: true, variables: true },
    genAI: { inputs: false, outputs: false },
    // Database query values were only sent with `sendDefaultPii: true` (e.g. Supabase gated on it),
    // so map the legacy "off" state to `false`.
    databaseQueryData: false,
    stackFrameVariables: true,
    frameContextLines: 7
    // default should be 5, but ContextLines integration uses 7
  };
}

exports.defaultPiiToCollectionOptions = defaultPiiToCollectionOptions;
//# sourceMappingURL=defaultPiiToCollectionOptions.js.map
