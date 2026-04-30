Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

/**
 * Transforms a `Headers` object that implements the `Web Fetch API` (https://developer.mozilla.org/en-US/docs/Web/API/Headers) into a simple key-value dict.
 * The header keys will be lower case: e.g. A "Content-Type" header will be stored as "content-type".
 */
function winterCGHeadersToDict(winterCGHeaders) {
  const headers = {};
  try {
    winterCGHeaders.forEach((value, key) => {
      if (typeof value === 'string') {
        // We check that value is a string even though it might be redundant to make sure prototype pollution is not possible.
        headers[key] = value;
      }
    });
  } catch {
    // just return the empty headers
  }

  return headers;
}

/**
 * Convert common request headers to a simple dictionary.
 */
function headersToDict(reqHeaders) {
  const headers = Object.create(null);

  try {
    Object.entries(reqHeaders).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  } catch {
    // just return the empty headers
  }

  return headers;
}

/**
 * Converts a `Request` object that implements the `Web Fetch API` (https://developer.mozilla.org/en-US/docs/Web/API/Headers) into the format that the `RequestData` integration understands.
 */
function winterCGRequestToRequestData(req) {
  const headers = winterCGHeadersToDict(req.headers);

  return {
    method: req.method,
    url: req.url,
    query_string: extractQueryParamsFromUrl(req.url),
    headers,
    // TODO: Can we extract body data from the request?
  };
}

/**
 * Convert a HTTP request object to RequestEventData to be passed as normalizedRequest.
 * Instead of allowing `PolymorphicRequest` to be passed,
 * we want to be more specific and generally require a http.IncomingMessage-like object.
 */
function httpRequestToRequestData(request

) {
  const headers = request.headers || {};

  // Check for x-forwarded-host first, then fall back to host header
  const forwardedHost = typeof headers['x-forwarded-host'] === 'string' ? headers['x-forwarded-host'] : undefined;
  const host = forwardedHost || (typeof headers.host === 'string' ? headers.host : undefined);

  // Check for x-forwarded-proto first, then fall back to existing protocol detection
  const forwardedProto = typeof headers['x-forwarded-proto'] === 'string' ? headers['x-forwarded-proto'] : undefined;
  const protocol = forwardedProto || request.protocol || (request.socket?.encrypted ? 'https' : 'http');

  const url = request.url || '';

  const absoluteUrl = getAbsoluteUrl({
    url,
    host,
    protocol,
  });

  // This is non-standard, but may be sometimes set
  // It may be overwritten later by our own body handling
  const data = (request ).body || undefined;

  // This is non-standard, but may be set on e.g. Next.js or Express requests
  const cookies = (request ).cookies;

  return {
    url: absoluteUrl,
    method: request.method,
    query_string: extractQueryParamsFromUrl(url),
    headers: headersToDict(headers),
    cookies,
    data,
  };
}

function getAbsoluteUrl({
  url,
  protocol,
  host,
}

) {
  if (url?.startsWith('http')) {
    return url;
  }

  if (url && host) {
    return `${protocol}://${host}${url}`;
  }

  return undefined;
}

const SENSITIVE_HEADER_SNIPPETS = [
  'auth',
  'token',
  'secret',
  'session', // for the user_session cookie
  'password',
  'passwd',
  'pwd',
  'key',
  'jwt',
  'bearer',
  'sso',
  'saml',
  'csrf',
  'xsrf',
  'credentials',
  // Always treat cookie headers as sensitive in case individual key-value cookie pairs cannot properly be extracted
  'set-cookie',
  'cookie',
];

/**
 * Extra substrings matched only against individual Cookie / Set-Cookie **names** (not header names),
 * so we can cover common session secrets that do not match {@link SENSITIVE_HEADER_SNIPPETS}
 * (e.g. `connect.sid` does not contain `session`) without false positives on arbitrary HTTP headers.
 *
 * Cookie names are checked with the same `includes()` list as headers plus these entries; omit redundant
 * cookie-only snippets that are already implied by a header match (e.g. `oauth` → `auth`, `id_token` → `token`,
 * `next-auth` → `auth`).
 */
const SENSITIVE_COOKIE_NAME_SNIPPETS = [
  // Express / Connect default session cookie
  '.sid',
  // Opaque session ids (PHPSESSID, ASPSESSIONID*, BIGipServer*, *sessid*, …)
  'sessid',
  // Laravel etc. "remember me" tokens
  'remember',
  // OIDC / OAuth auxiliary (`oauth*` covered by header snippet `auth`)
  'oidc',
  'pkce',
  'nonce',
  // RFC 6265bis high-security cookie name prefixes
  '__secure-',
  '__host-',
  // Load balancer / CDN sticky-session cookies (opaque routing tokens)
  'awsalb',
  'awselb',
  'akamai',
  // BaaS / IdP session cookies (names often omit "session")
  '__stripe',
  'cognito',
  'firebase',
  'supabase',
  'sb-',
  // Step-up / MFA cookies
  'mfa',
  '2fa',
];

const PII_HEADER_SNIPPETS = ['x-forwarded-', '-user'];

/**
 * Converts incoming HTTP request or response headers to OpenTelemetry span attributes following semantic conventions.
 * Header names are converted to the format: http.<request|response>.header.<key>
 * where <key> is the header name in lowercase with dashes converted to underscores.
 *
 * @param lifecycle - The lifecycle of the headers, either 'request' or 'response'
 *
 * @see https://opentelemetry.io/docs/specs/semconv/registry/attributes/http/#http-request-header
 * @see https://opentelemetry.io/docs/specs/semconv/registry/attributes/http/#http-response-header
 *
 * @see https://getsentry.github.io/sentry-conventions/attributes/http/#http-request-header-key
 * @see https://getsentry.github.io/sentry-conventions/attributes/http/#http-response-header-key
 */
function httpHeadersToSpanAttributes(
  headers,
  sendDefaultPii = false,
  lifecycle = 'request',
) {
  const spanAttributes = {};

  try {
    Object.entries(headers).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      const lowerCasedHeaderKey = key.toLowerCase();
      const isCookieHeader = lowerCasedHeaderKey === 'cookie' || lowerCasedHeaderKey === 'set-cookie';

      if (isCookieHeader && typeof value === 'string' && value !== '') {
        // Set-Cookie: single cookie with attributes ("name=value; HttpOnly; Secure")
        // Cookie: multiple cookies separated by "; " ("cookie1=value1; cookie2=value2")
        const isSetCookie = lowerCasedHeaderKey === 'set-cookie';
        const semicolonIndex = value.indexOf(';');
        const cookieString = isSetCookie && semicolonIndex !== -1 ? value.substring(0, semicolonIndex) : value;
        const cookies = isSetCookie ? [cookieString] : cookieString.split('; ');

        for (const cookie of cookies) {
          // Split only at the first '=' to preserve '=' characters in cookie values
          const equalSignIndex = cookie.indexOf('=');
          const cookieKey = equalSignIndex !== -1 ? cookie.substring(0, equalSignIndex) : cookie;
          const cookieValue = equalSignIndex !== -1 ? cookie.substring(equalSignIndex + 1) : '';

          const lowerCasedCookieKey = cookieKey.toLowerCase();

          addSpanAttribute({
            spanAttributes,
            headerKey: lowerCasedHeaderKey,
            cookieKey: lowerCasedCookieKey,
            value: cookieValue,
            sendDefaultPii,
            lifecycle,
          });
        }
      } else {
        addSpanAttribute({
          spanAttributes,
          headerKey: lowerCasedHeaderKey,
          value,
          sendDefaultPii,
          lifecycle,
        });
      }
    });
  } catch {
    // Return empty object if there's an error
  }

  return spanAttributes;
}

function normalizeAttributeKey(key) {
  return key.replace(/-/g, '_');
}

function addSpanAttribute({
  spanAttributes,
  headerKey,
  cookieKey,
  value,
  sendDefaultPii,
  lifecycle,
}) {
  const isCookieSubKey = Boolean(cookieKey);
  const nameForSensitivity = cookieKey || headerKey;
  const headerValue = handleHttpHeader(nameForSensitivity, value, sendDefaultPii, isCookieSubKey);
  if (headerValue == null) {
    return;
  }

  const normalizedKey = `http.${lifecycle}.header.${normalizeAttributeKey(headerKey)}${cookieKey ? `.${normalizeAttributeKey(cookieKey)}` : ''}`;
  spanAttributes[normalizedKey] = headerValue;
}

function handleHttpHeader(
  lowerCasedKey,
  value,
  sendPii,
  isCookieSubKey = false,
) {
  const snippetsForSensitivity = isCookieSubKey
    ? [...SENSITIVE_HEADER_SNIPPETS, ...SENSITIVE_COOKIE_NAME_SNIPPETS]
    : SENSITIVE_HEADER_SNIPPETS;

  const isSensitive = sendPii
    ? snippetsForSensitivity.some(snippet => lowerCasedKey.includes(snippet))
    : [...PII_HEADER_SNIPPETS, ...snippetsForSensitivity].some(snippet => lowerCasedKey.includes(snippet));

  if (isSensitive) {
    return '[Filtered]';
  } else if (Array.isArray(value)) {
    return value.map(v => (v != null ? String(v) : v)).join(';');
  } else if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

/** Extract the query params from an URL. */
function extractQueryParamsFromUrl(url) {
  // url is path and query string
  if (!url) {
    return;
  }

  try {
    // The `URL` constructor can't handle internal URLs of the form `/some/path/here`, so stick a dummy protocol and
    // hostname as the base. Since the point here is just to grab the query string, it doesn't matter what we use.
    const queryParams = new URL(url, 'http://s.io').search.slice(1);
    return queryParams.length ? queryParams : undefined;
  } catch {
    return undefined;
  }
}

exports.extractQueryParamsFromUrl = extractQueryParamsFromUrl;
exports.headersToDict = headersToDict;
exports.httpHeadersToSpanAttributes = httpHeadersToSpanAttributes;
exports.httpRequestToRequestData = httpRequestToRequestData;
exports.winterCGHeadersToDict = winterCGHeadersToDict;
exports.winterCGRequestToRequestData = winterCGRequestToRequestData;
//# sourceMappingURL=request.js.map
