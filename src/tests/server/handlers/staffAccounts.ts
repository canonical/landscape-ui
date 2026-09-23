import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import type {
  StaffAccount,
  StaffAccountListItem,
  StaffInvitationResult,
  StaffInvitationRow,
  StaffPeopleResult,
  StaffPersonResult,
  StaffPersonRow,
  WslFeatureLimits,
} from "@/tests/mocks/staffAccounts";
import {
  createStaffAccounts,
  defaultWslFeatureLimits,
  staffInvitations,
  staffPeople,
} from "@/tests/mocks/staffAccounts";

// The staff (super admin) endpoints, mirroring the real V2 API handlers
// (`api/account.py`, `api/person.py`) as closely as possible — status codes,
// error envelopes and check ordering included — because API e2e tests will
// run the same flows against the real backend and divergent mocks surface as
// e2e failures there.
//
// Check ordering mirrors the server's decorator chain: 400 query/body
// validation (pydantic runs before the handler) → 403 (global permission,
// checked BEFORE the account lookup so account existence is never disclosed
// to unauthorized callers) → 404 → handler-level 400.
//
// The server's 401 for a request without a JWT is deliberately not mirrored:
// tests render through the real fetch providers, which have no auth token and
// send no `Authorization` header, so a header check would reject every request
// (and the 401 interceptor would log the test user out).

const STAFF_PAGE_DEFAULT_LIMIT = 25;
const STAFF_PAGE_MAX_LIMIT = 100;
const STAFF_PEOPLE_SEARCH_MIN_LENGTH = 3;

/**
 * The caller's global (deployment-wide) roles, driving both the staff
 * endpoints' permission checks and the `global_roles` field on `GET me`.
 * Empty — a regular non-staff user — by default; tests opt into staff
 * behavior with `setStaffGlobalRoles`.
 */
export const staffState = {
  globalRoles: [] as string[],
  /**
   * The caller's account membership for `POST switch-account`. `null` keeps the
   * default union of the member-account fixtures; tests that need to exercise
   * the non-member path narrow it with `setCallerAccounts`.
   */
  callerAccounts: null as string[] | null,
};

/** Sets the caller's global roles, sorted as the server returns them. */
export const setStaffGlobalRoles = (roles: string[]): void => {
  staffState.globalRoles = [...roles].sort();
};

export const setCallerAccounts = (accounts: string[] | null): void => {
  staffState.callerAccounts = accounts;
};

let staffAccounts = createStaffAccounts();
let wslFeatureLimits: Record<string, WslFeatureLimits> = {};

export const resetStaffState = (): void => {
  staffState.globalRoles = [];
  staffState.callerAccounts = null;
  staffAccounts = createStaffAccounts();
  wslFeatureLimits = {};
};

export const getStaffAccountByName = (name: string): StaffAccount | undefined =>
  staffAccounts.find(({ account }) => account === name);

// `ViewAllAccounts` is granted to SupportProvider and inherited by
// AccountManager; `CreateAccount` is AccountManager-only (the write tier).
export const hasViewAllAccounts = (): boolean =>
  staffState.globalRoles.includes("SupportProvider") ||
  staffState.globalRoles.includes("AccountManager");

export const hasCreateAccount = (): boolean =>
  staffState.globalRoles.includes("AccountManager");

// --- Error envelopes, verbatim from the server ---

/** `UnauthorizedAccess`, raised by `check_person_global_permission`. */
const unauthorizedAccessResponse = () =>
  HttpResponse.json(
    {
      error: "UnauthorizedAccess",
      message: "You do not have permission to perform this action.",
      detail: null,
    },
    { status: 403 },
  );

/** `ApiRequestError(message="Not found", code=404)` — PATCH account. */
const accountNotFoundResponse = () =>
  HttpResponse.json(
    { error: "ApiRequestError", message: "Not found", detail: null },
    { status: 404 },
  );

/** The generic `NotFound` — GET account and the WSL feature limits handlers. */
const notFoundResponse = () =>
  HttpResponse.json(
    { error: "NotFound", message: "Not found.", detail: null },
    { status: 404 },
  );

interface PydanticErrorDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
}

/** `PydanticValidationError` for invalid query/body arguments. */
const validationErrorResponse = (detail: PydanticErrorDetail[]) =>
  HttpResponse.json(
    {
      error: "PydanticValidationError",
      message: "invalid query/body arguments",
      detail,
    },
    { status: 400 },
  );

/** Handler-level `ApiRequestError` (e.g. a rejected Salesforce key). */
const apiRequestErrorResponse = (message: string) =>
  HttpResponse.json(
    { error: "ApiRequestError", message, detail: null },
    { status: 400 },
  );

// --- Salesforce key validation (`ui/salesforce/key.py`) ---

const SALESFORCE_KEY_SIGNATURE = "1-001";
const SALESFORCE_KEY_LENGTH_SHORT = 17;
const SALESFORCE_KEY_LENGTH_LONG = 20;

const SALESFORCE_ACCOUNT_KEY_ERROR =
  `Salesforce account keys must be 17 or 20 characters, start with ` +
  `'${SALESFORCE_KEY_SIGNATURE}' and may only contain alphanumeric ` +
  `characters after the version prefix`;

const isValidSalesforceAccountKey = (key: string): boolean =>
  key.startsWith(SALESFORCE_KEY_SIGNATURE) &&
  [SALESFORCE_KEY_LENGTH_SHORT, SALESFORCE_KEY_LENGTH_LONG].includes(
    key.length,
  ) &&
  /^[a-zA-Z0-9]+$/.test(key.slice(2));

// --- Subdomain validation (`AccountPatchBody`, `set_account_subdomain`) ---

// A single DNS label, per RFC 1034 section 3.1 (1–63 characters).
const SUBDOMAIN_MAX_LENGTH = 63;
const SUBDOMAIN_PATTERN = /^[a-z]([a-z0-9-]*[a-z0-9])?$/;

const DISALLOWED_SUBDOMAINS = ["landscape", "saas"];

// The server interpolates the Python list, repr and all.
const DISALLOWED_SUBDOMAIN_ERROR =
  "Cannot set subdomain to any of '['landscape', 'saas']'";

const toListItem = (account: StaffAccount): StaffAccountListItem => ({
  account: account.account,
  company: account.company,
  subdomain: account.subdomain,
  disabled: account.disabled,
  computers: account.computers,
  creation_time: account.creation_time,
  salesforce_account_key: account.salesforce_account_key,
  enabled_features: account.enabled_features,
  lds_enabled: account.lds_enabled,
});

// Case-insensitive substring match over account name, title, subdomain,
// Salesforce key, and administrator name/email — the server's search scope.
const matchesSearch = (account: StaffAccount, search: string): boolean => {
  const needle = search.toLowerCase();

  return [
    account.account,
    account.company,
    account.subdomain,
    account.salesforce_account_key,
    ...account.administrators.flatMap(({ name, email }) => [name, email]),
  ].some((value) => value?.toLowerCase().includes(needle));
};

const getWslLimits = (name: string): WslFeatureLimits =>
  wslFeatureLimits[name] ?? { ...defaultWslFeatureLimits };

const rangeErrors = (
  field: string,
  value: unknown,
  { gt, ge, le }: { gt?: number; ge?: number; le?: number },
): PydanticErrorDetail[] => {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return [
      {
        type: "int_parsing",
        loc: [field],
        msg: "Input should be a valid integer, unable to parse string as an integer",
      },
    ];
  }

  if (gt !== undefined && value <= gt) {
    return [
      {
        type: "greater_than",
        loc: [field],
        msg: `Input should be greater than ${gt}`,
      },
    ];
  }

  if (ge !== undefined && value < ge) {
    return [
      {
        type: "greater_than_equal",
        loc: [field],
        msg: `Input should be greater than or equal to ${ge}`,
      },
    ];
  }

  if (le !== undefined && value > le) {
    return [
      {
        type: "less_than_equal",
        loc: [field],
        msg: `Input should be less than or equal to ${le}`,
      },
    ];
  }

  return [];
};

// The integer strings the server's pydantic (2.4) accepts in a query: an
// optional sign, then digits with single underscores between them, or digits
// followed by `.` and only zeros. No surrounding whitespace, no hex or
// exponents, unlike `Number()`.
const QUERY_INTEGER_PATTERN = /^[+-]?(\d+(_\d+)*|\d+\.0*)$/;

/** The integer in a query parameter, or `NaN` when pydantic would reject it. */
const parseQueryInteger = (value: string): number =>
  QUERY_INTEGER_PATTERN.test(value) ? Number(value.replaceAll("_", "")) : NaN;

/** The `limit` and `offset` query parameters, with the server's defaults. */
const getPageParams = (searchParams: URLSearchParams) => {
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  return {
    limit: limit === null ? STAFF_PAGE_DEFAULT_LIMIT : parseQueryInteger(limit),
    offset: offset === null ? 0 : parseQueryInteger(offset),
  };
};

/** Validation of `limit: PositiveInt` (at most 100) and `offset: NonNegativeInt`. */
const pageErrors = ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): PydanticErrorDetail[] => [
  ...rangeErrors("limit", limit, { gt: 0, le: STAFF_PAGE_MAX_LIMIT }),
  ...rangeErrors("offset", offset, { ge: 0 }),
];

interface AccountPatchBody {
  enabled_features?: number[];
  subdomain?: string | null;
  max_people_count?: number;
  max_attachment_size?: number;
  salesforce_account_key?: string | null;
}

/** Pydantic's rejection of a JSON body that is not an object (`null`, a number, ...). */
const NON_OBJECT_BODY_ERROR: PydanticErrorDetail = {
  type: "model_attributes_type",
  loc: ["body"],
  msg: "Input should be a valid dictionary or object to extract fields from",
};

const isJsonObject = (body: unknown): body is Record<string, unknown> =>
  typeof body === "object" && body !== null && !Array.isArray(body);

/** Validation of a present, non-null `subdomain` against the `Subdomain` type. */
const subdomainErrors = (subdomain: unknown): PydanticErrorDetail[] => {
  if (typeof subdomain !== "string") {
    return [
      {
        type: "string_type",
        loc: ["subdomain"],
        msg: "Input should be a valid string",
      },
    ];
  }

  if (!subdomain.length) {
    return [
      {
        type: "string_too_short",
        loc: ["subdomain"],
        msg: "String should have at least 1 character",
      },
    ];
  }

  if (subdomain.length > SUBDOMAIN_MAX_LENGTH) {
    return [
      {
        type: "string_too_long",
        loc: ["subdomain"],
        msg: `String should have at most ${SUBDOMAIN_MAX_LENGTH} characters`,
      },
    ];
  }

  if (!SUBDOMAIN_PATTERN.test(subdomain)) {
    return [
      {
        type: "string_pattern_mismatch",
        loc: ["subdomain"],
        msg: `String should match pattern '${SUBDOMAIN_PATTERN.source}'`,
      },
    ];
  }

  return [];
};

/**
 * Body validation for `PATCH accounts/:name`, mirroring the pydantic model that
 * runs before the handler. Field types are checked as well as values, so a
 * malformed body yields a 400 envelope instead of throwing inside the handler.
 */
const accountPatchErrors = (body: AccountPatchBody): PydanticErrorDetail[] => {
  if (!isJsonObject(body)) {
    return [NON_OBJECT_BODY_ERROR];
  }

  const detail: PydanticErrorDetail[] = [];

  if (Array.isArray(body.enabled_features)) {
    const knownFeatureKeys = features.map(({ database_key }) => database_key);

    body.enabled_features.forEach((key, index) => {
      if (!knownFeatureKeys.includes(key)) {
        detail.push({
          type: "value_error",
          loc: ["enabled_features", index],
          msg: `Value error, ${key} not in known FeatureFlag IDs.`,
        });
      }
    });
  } else if (body.enabled_features !== undefined) {
    detail.push({
      type: "list_type",
      loc: ["enabled_features"],
      msg: "Input should be a valid list",
    });
  }

  if (body.subdomain !== undefined && body.subdomain !== null) {
    detail.push(...subdomainErrors(body.subdomain));
  }

  if (body.max_people_count !== undefined) {
    detail.push(
      ...rangeErrors("max_people_count", body.max_people_count, {
        ge: 1,
        le: 100,
      }),
    );
  }

  if (body.max_attachment_size !== undefined) {
    detail.push(
      ...rangeErrors("max_attachment_size", body.max_attachment_size, {
        ge: 0,
      }),
    );
  }

  if (
    body.salesforce_account_key !== undefined &&
    body.salesforce_account_key !== null &&
    typeof body.salesforce_account_key !== "string"
  ) {
    detail.push({
      type: "string_type",
      loc: ["salesforce_account_key"],
      msg: "Input should be a valid string",
    });
  }

  return detail;
};

/** The `set_account_subdomain` error message for `subdomain`, if any. */
const subdomainRejection = (
  account: StaffAccount,
  subdomain: string | null | undefined,
): string | undefined => {
  if (typeof subdomain !== "string") {
    return undefined;
  }

  if (DISALLOWED_SUBDOMAINS.includes(subdomain)) {
    return DISALLOWED_SUBDOMAIN_ERROR;
  }

  const holder = staffAccounts.find(
    (other) =>
      other.account !== account.account && other.subdomain === subdomain,
  );

  return holder
    ? `Subdomains must be unique across accounts; '${subdomain}' already set on '${holder.account}'`
    : undefined;
};

/** The `SalesforceKeyError` message for `key`, if any. */
const salesforceKeyRejection = (
  account: StaffAccount,
  key: string | null | undefined,
): string | undefined => {
  if (typeof key !== "string") {
    return undefined;
  }

  if (!isValidSalesforceAccountKey(key)) {
    return SALESFORCE_ACCOUNT_KEY_ERROR;
  }

  const holder = staffAccounts.find(
    (other) =>
      other.account !== account.account && other.salesforce_account_key === key,
  );

  // The trailing space is in the server string too, not a typo here — see
  // `SalesforceKeyAlreadyInUseError` in `ui/salesforce/key.py`.
  return holder
    ? `Salesforce account key is already used by account ${holder.company} (${holder.account}) `
    : undefined;
};

const WSL_LIMIT_FIELDS = [
  "max_windows_host_machines",
  "max_wsl_child_instances_per_host",
  "max_wsl_child_instance_profiles",
] as const;

/**
 * Body validation for `POST accounts/:name/wsl-feature-limits`. Only the
 * integer type is asserted for present fields — the server's bounds for these
 * are not mirrored here, so no range is invented.
 */
const wslLimitErrors = (
  body: Partial<WslFeatureLimits>,
): PydanticErrorDetail[] => {
  if (!isJsonObject(body)) {
    return [NON_OBJECT_BODY_ERROR];
  }

  return WSL_LIMIT_FIELDS.flatMap((field) =>
    body[field] === undefined
      ? [{ type: "missing", loc: [field], msg: "Field required" }]
      : rangeErrors(field, body[field], {}),
  );
};

// --- People search (`api/person.py`, `get_staff_people_page`) ---

/** Validation of `search` (required, at least 3 characters) and `type`. */
const peopleQueryErrors = (
  search: string | null,
  type: string | null,
): PydanticErrorDetail[] => {
  const detail: PydanticErrorDetail[] = [];

  if (search === null) {
    detail.push({ type: "missing", loc: ["search"], msg: "Field required" });
  } else if (search.length < STAFF_PEOPLE_SEARCH_MIN_LENGTH) {
    detail.push({
      type: "string_too_short",
      loc: ["search"],
      msg: `String should have at least ${STAFF_PEOPLE_SEARCH_MIN_LENGTH} characters`,
    });
  }

  if (type !== null && type !== "person" && type !== "invitation") {
    detail.push({
      type: "literal_error",
      loc: ["type"],
      msg: "Input should be 'person' or 'invitation'",
    });
  }

  return detail;
};

/** Compares by each key in turn, like a multi-column `ORDER BY`. */
const orderBy =
  <T>(...keys: ((item: T) => string | number)[]) =>
  (a: T, b: T): number => {
    for (const key of keys) {
      const left = key(a);
      const right = key(b);

      if (left !== right) {
        return left < right ? -1 : 1;
      }
    }

    return 0;
  };

const includesIgnoringCase = (value: string, search: string): boolean =>
  value.toLowerCase().includes(search.toLowerCase());

type JoinedInvitation = StaffInvitationRow & { company: string };

/** The invitations joined with their target account, as the server's query does. */
const getJoinedInvitations = (): JoinedInvitation[] =>
  staffInvitations.flatMap((invitation) => {
    const target = getStaffAccountByName(invitation.account);

    return target ? [{ ...invitation, company: target.company }] : [];
  });

const toPersonResult = (
  person: StaffPersonRow,
  invitations: JoinedInvitation[],
): StaffPersonResult => ({
  type: "person",
  id: person.id,
  name: person.name,
  email: person.email,
  identity: person.identity,
  last_login_time: person.last_login_time,
  // `staffAccounts` is sorted by name, the server's order for memberships.
  accounts: staffAccounts
    .filter(({ account }) => person.accounts.includes(account))
    .map(({ account, company, salesforce_account_key }) => ({
      account,
      company,
      salesforce_account_key,
    })),
  pending_invitations: invitations
    .filter(({ email }) => email.toLowerCase() === person.email.toLowerCase())
    .sort(
      orderBy(
        (invitation) => invitation.creation_time,
        (invitation) => invitation.account,
      ),
    )
    .map(({ account, company, creation_time }) => ({
      account,
      company,
      creation_time,
    })),
});

const toInvitationResult = (
  invitation: JoinedInvitation,
): StaffInvitationResult => ({
  type: "invitation",
  id: invitation.id,
  name: invitation.name,
  email: invitation.email,
  account: invitation.account,
  company: invitation.company,
  salesforce_key: invitation.salesforce_key,
  creation_time: invitation.creation_time,
});

export default [
  http.get(`${API_URL}accounts`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const { limit, offset } = getPageParams(searchParams);

    const detail = pageErrors({ limit, offset });

    if (detail.length) {
      return validationErrorResponse(detail);
    }

    if (!hasViewAllAccounts()) {
      return unauthorizedAccessResponse();
    }

    const matching = search
      ? staffAccounts.filter((account) => matchesSearch(account, search))
      : staffAccounts;

    return HttpResponse.json({
      count: matching.length,
      results: matching.slice(offset, offset + limit).map(toListItem),
    });
  }),

  http.get<{ name: string }>(`${API_URL}accounts/:name`, ({ params }) => {
    if (!hasViewAllAccounts()) {
      return unauthorizedAccessResponse();
    }

    const account = getStaffAccountByName(params.name);

    if (!account) {
      return notFoundResponse();
    }

    return HttpResponse.json(account);
  }),

  http.patch<{ name: string }, AccountPatchBody>(
    `${API_URL}accounts/:name`,
    async ({ request, params }) => {
      const body = await request.json();
      const detail = accountPatchErrors(body);

      if (detail.length) {
        return validationErrorResponse(detail);
      }

      if (!hasCreateAccount()) {
        return unauthorizedAccessResponse();
      }

      const account = getStaffAccountByName(params.name);

      if (!account) {
        return accountNotFoundResponse();
      }

      // Handler-level rejections, in the server's order. The server applies
      // fields as it goes but the error rolls the transaction back, so
      // checking before touching anything leaves the same end state.
      const rejection =
        subdomainRejection(account, body.subdomain) ??
        salesforceKeyRejection(account, body.salesforce_account_key);

      if (rejection) {
        return apiRequestErrorResponse(rejection);
      }

      // JSON Merge Patch: only provided fields are touched.
      if (body.enabled_features !== undefined) {
        account.enabled_features = [...new Set(body.enabled_features)];
      }

      if (body.subdomain !== undefined) {
        account.subdomain = body.subdomain;
      }

      if (body.max_people_count !== undefined) {
        account.max_people_count = body.max_people_count;
      }

      if (body.max_attachment_size !== undefined) {
        account.max_attachment_size = body.max_attachment_size;
      }

      if (body.salesforce_account_key !== undefined) {
        account.salesforce_account_key = body.salesforce_account_key;
      }

      return HttpResponse.json(account);
    },
  ),

  http.get<{ name: string }>(
    `${API_URL}accounts/:name/wsl-feature-limits`,
    ({ params }) => {
      if (!hasViewAllAccounts()) {
        return unauthorizedAccessResponse();
      }

      if (!getStaffAccountByName(params.name)) {
        return notFoundResponse();
      }

      return HttpResponse.json(getWslLimits(params.name));
    },
  ),

  http.post<{ name: string }, Partial<WslFeatureLimits>>(
    `${API_URL}accounts/:name/wsl-feature-limits`,
    async ({ request, params }) => {
      const body = await request.json();

      const detail = wslLimitErrors(body);

      if (detail.length) {
        return validationErrorResponse(detail);
      }

      if (!hasCreateAccount()) {
        return unauthorizedAccessResponse();
      }

      if (!getStaffAccountByName(params.name)) {
        return notFoundResponse();
      }

      const limits = body as WslFeatureLimits;
      wslFeatureLimits[params.name] = limits;

      return HttpResponse.json(limits);
    },
  ),

  http.get(`${API_URL}people`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const { limit, offset } = getPageParams(searchParams);

    const detail = [
      ...peopleQueryErrors(search, type),
      ...pageErrors({ limit, offset }),
    ];

    // A missing `search` is already in `detail`; the null check narrows it.
    if (search === null || detail.length) {
      return validationErrorResponse(detail);
    }

    if (!hasViewAllAccounts()) {
      return unauthorizedAccessResponse();
    }

    const invitations = getJoinedInvitations();

    // Names and emails match as case-insensitive substrings; invitations
    // also match their Salesforce key exactly.
    const people =
      type === "invitation"
        ? []
        : staffPeople
            .filter(
              ({ name, email }) =>
                includesIgnoringCase(name, search) ||
                includesIgnoringCase(email, search),
            )
            .map((person) => toPersonResult(person, invitations));

    const invited =
      type === "person"
        ? []
        : invitations
            .filter(
              ({ name, email, salesforce_key }) =>
                includesIgnoringCase(name, search) ||
                includesIgnoringCase(email, search) ||
                salesforce_key === search,
            )
            .map(toInvitationResult);

    const results: StaffPeopleResult[] = [...people, ...invited].sort(
      orderBy(
        (result) => result.name.toLowerCase(),
        (result) => result.type,
        (result) => result.id,
      ),
    );

    return HttpResponse.json({
      count: results.length,
      results: results.slice(offset, offset + limit),
    });
  }),
];
