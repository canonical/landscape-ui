import * as Yup from "yup";

/**
 * Client-side approximation of landscape-server's pydantic `EmailStr`
 * (pydantic 2.4.2 -> email-validator 2.2.0, syntax checks only, default
 * options). Hand port of email-validator's `syntax.py` / `validate_email.py`.
 *
 * Non-ASCII domains are converted to punycode with the platform's `URL`
 * instead of porting IDNA. `URL` implements UTS 46 but not the IDNA 2008
 * checks (Bidi, ContextJ, contextual rules) that the server applies through
 * the `idna` package, so the client may accept some exotic Unicode domains the
 * server rejects. The reverse also happens for a few characters whose UTS 46
 * data differs between `URL` and `idna` (for example invisible Hangul fillers,
 * which the server drops and `URL` rejects).
 *
 * Intentional divergence: the server also accepts the "pretty" form
 * `Name <addr>` (and `<addr>`). This validator rejects it, because users never
 * type it into these fields and accepting it would leave the UI holding a
 * different string than the one the server stores. Quoted local parts and
 * domain literals need no special handling: `"`, `<`, `>`, `[` and `]` are not
 * valid anywhere else, so they are rejected as a result.
 */

export const EMAIL_ERROR_MESSAGE = "Please provide a valid email address";

// pydantic 2.4.2 networks.MAX_EMAIL_LENGTH, counted in characters.
const PYDANTIC_MAX_LENGTH = 2048;

// email-validator rfc_constants.py
const EMAIL_MAX_LENGTH = 254; // UTF-8 octets
const LOCAL_PART_MAX_LENGTH = 64; // characters, not octets
const DOMAIN_MAX_LENGTH = 253;
const DNS_LABEL_MAX_LENGTH = 63;

const ATEXT = "a-zA-Z0-9_!#$%&'*+\\-/=?^`{|}~";
const ATEXT_INTL = `${ATEXT}\\u{80}-\\u{10FFFF}`;

const DOT_ATOM_TEXT = new RegExp(`^[${ATEXT}]+(?:\\.[${ATEXT}]+)*$`, "u");
const DOT_ATOM_TEXT_INTL = new RegExp(
  `^[${ATEXT_INTL}]+(?:\\.[${ATEXT_INTL}]+)*$`,
  "u",
);
const HOSTNAME_LABEL = "(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)";
const HOSTNAME = new RegExp(`^${HOSTNAME_LABEL}(?:\\.${HOSTNAME_LABEL})*$`);
// Only these ASCII characters may reach `URL`; anything else (`/`, `?`, `#`,
// `:`, `%`, `@`, ...) would be parsed as URL syntax instead of rejected.
const HOSTNAME_CHAR = /^[a-zA-Z0-9.-]$/;
const UNSAFE_CHAR = /^[\p{C}\p{Z}]$/u;
const MARK = /^\p{M}$/u;
const NON_ASCII = /\P{ASCII}/u;
const TLD_ENDS_WITH_LETTER = /[a-z]$/;
const RESERVED_LABEL = /^(?!xn)..--/iu;
const UNICODE_DOTS = /[\u3002\uff0e\uff61]/g;

// Characters Python's str.strip() removes. pydantic strips the address before
// validating it, so the server accepts surrounding whitespace.
const PYTHON_WHITESPACE =
  "\\t-\\r\\u001c-\\u0020\\u0085\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";
const SURROUNDING_WHITESPACE = new RegExp(
  `^[${PYTHON_WHITESPACE}]+|[${PYTHON_WHITESPACE}]+$`,
  "g",
);

// email-validator's SPECIAL_USE_DOMAIN_NAMES (IANA special-use names). The
// server rejects these and any subdomain of them, so addresses such as
// user@corp.local or user@host.test fail on the server too. "example.com" and
// friends are deliberately not in the list.
// https://github.com/JoshData/python-email-validator/blob/v2.2.0/email_validator/__init__.py
const SPECIAL_USE_DOMAIN_NAMES = [
  "arpa",
  "invalid",
  "local",
  "localhost",
  "onion",
  "test",
];

const ASCII_LIMIT = 0x80;
const utf8 = new TextEncoder();

const toCodePoints = (value: string): string[] => Array.from(value);

/** email-validator syntax.check_unsafe_chars: only code points >= U+0080 matter here. */
const hasOnlySafeChars = (codePoints: readonly string[]): boolean =>
  codePoints.every((char, index) => {
    if ((char.codePointAt(0) as number) < ASCII_LIMIT) {
      return true;
    }

    // A combining mark in first position would combine with what precedes it.
    return !UNSAFE_CHAR.test(char) && (index !== 0 || !MARK.test(char));
  });

/** email-validator syntax.validate_email_local_part (no quoted form, SMTPUTF8 allowed). */
const isValidLocalPart = (local: string): boolean => {
  const codePoints = toCodePoints(local);

  if (codePoints.length === 0 || codePoints.length > LOCAL_PART_MAX_LENGTH) {
    return false;
  }

  return (
    DOT_ATOM_TEXT.test(local) ||
    (DOT_ATOM_TEXT_INTL.test(local) && hasOnlySafeChars(codePoints))
  );
};

const toPunycodeHostname = (domain: string): string | undefined => {
  try {
    return new URL(`http://${domain}`).hostname || undefined;
  } catch {
    return undefined;
  }
};

/** Returns the lowercase ASCII (punycode) form of the domain, or undefined. */
const toAsciiDomain = (domain: string): string | undefined => {
  const codePoints = toCodePoints(domain);

  if (
    !codePoints.every(
      (char) =>
        (char.codePointAt(0) as number) >= ASCII_LIMIT ||
        HOSTNAME_CHAR.test(char),
    ) ||
    !hasOnlySafeChars(codePoints)
  ) {
    return undefined;
  }

  if (!NON_ASCII.test(domain)) {
    // UTS 46 remapping of ASCII is lowercasing.
    return domain.toLowerCase();
  }

  // email-validator checks hyphens and reserved labels before IDNA encoding,
  // and punycode would hide a trailing hyphen.
  if (
    domain
      .replace(UNICODE_DOTS, ".")
      .split(".")
      .some(
        (label) =>
          label.startsWith("-") ||
          label.endsWith("-") ||
          RESERVED_LABEL.test(label),
      )
  ) {
    return undefined;
  }

  return toPunycodeHostname(domain) ?? toPunycodeHostname(domain.toLowerCase());
};

/** email-validator syntax.validate_email_domain_name (globally_deliverable=True), on the ASCII form. */
const isValidAsciiDomain = (ascii: string): boolean => {
  const labels = ascii.split(".");

  return (
    HOSTNAME.test(ascii) &&
    // Labels like "ab--c" are reserved (RFC 5890 R-LDH) unless they are punycode.
    !labels.some((label) => RESERVED_LABEL.test(label)) &&
    ascii.length <= DOMAIN_MAX_LENGTH &&
    labels.every((label) => label.length <= DNS_LABEL_MAX_LENGTH) &&
    // The server only accepts globally deliverable names: a dot is required
    // and every TLD ends with a letter.
    labels.length > 1 &&
    TLD_ENDS_WITH_LETTER.test(ascii) &&
    !SPECIAL_USE_DOMAIN_NAMES.some(
      (name) => ascii === name || ascii.endsWith(`.${name}`),
    )
  );
};

const isValidAddress = (address: string): boolean => {
  const at = address.indexOf("@");

  if (at === -1) {
    return false;
  }

  const local = address.slice(0, at);
  const domain = address.slice(at + 1);

  // RFC 6532: email-validator returns the NFC form, which must be valid too.
  const normalizedLocal = local.normalize("NFC");
  const ascii = toAsciiDomain(domain);

  if (
    !isValidLocalPart(local) ||
    !isValidLocalPart(normalizedLocal) ||
    ascii === undefined ||
    !isValidAsciiDomain(ascii)
  ) {
    return false;
  }

  // validate_email_length checks the original, the normalized and the
  // IDNA-ASCII form, each in UTF-8 octets.
  return [address, `${normalizedLocal}@${ascii}`].every(
    (candidate) => utf8.encode(candidate).length <= EMAIL_MAX_LENGTH,
  );
};

/**
 * Whether landscape-server's `EmailStr` accepts `value`, except for the
 * `Name <addr>` form, which is rejected on purpose, and a few exotic Unicode
 * domains that are accepted here but rejected by the server (see above).
 * Syntax only: no DNS lookup, and the value is not normalized.
 */
export const isValidEmail = (value: string): boolean =>
  toCodePoints(value).length <= PYDANTIC_MAX_LENGTH &&
  isValidAddress(value.replace(SURROUNDING_WHITESPACE, ""));

/** Yup schema for an email field; empty values are left to `.required()`. */
export const emailSchema = () =>
  Yup.string().test(
    "email",
    EMAIL_ERROR_MESSAGE,
    (value) => !value || isValidEmail(value),
  );
