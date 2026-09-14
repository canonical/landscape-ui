import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import type {
  StaffAccount,
  StaffAccountListItem,
  WslFeatureLimits,
} from "@/tests/mocks/staffAccounts";
import {
  createStaffAccounts,
  defaultWslFeatureLimits,
} from "@/tests/mocks/staffAccounts";

// The staff (super admin) account endpoints, mirroring the real V2 API
// handlers (`api/account.py`) as closely as possible — status codes, error
// envelopes and check ordering included — because API e2e tests will run the
// same flows against the real backend and divergent mocks surface as e2e
// failures there.
//
// Check ordering mirrors the server's decorator chain: 401 (JWT) → 400
// query/body validation (pydantic runs before the handler) → 403 (global
// permission, checked BEFORE the account lookup so account existence is never
// disclosed to unauthorized callers) → 404 → handler-level 400.

const STAFF_ACCOUNT_PAGE_DEFAULT_LIMIT = 25;
const STAFF_ACCOUNT_PAGE_MAX_LIMIT = 100;

/**
 * The caller's global (deployment-wide) roles, driving both the staff
 * endpoints' permission checks and the `global_roles` field on `GET me`.
 * Empty — a regular non-staff user — by default; tests opt into staff
 * behavior with `setStaffGlobalRoles`.
 */
export const staffState = {
  globalRoles: [] as string[],
};

export const setStaffGlobalRoles = (roles: string[]): void => {
  staffState.globalRoles = roles;
};

let staffAccounts = createStaffAccounts();
let wslFeatureLimits: Record<string, WslFeatureLimits> = {};

export const resetStaffState = (): void => {
  staffState.globalRoles = [];
  staffAccounts = createStaffAccounts();
  wslFeatureLimits = {};
};

export const getStaffAccountByName = (
  name: string,
): StaffAccount | undefined =>
  staffAccounts.find(({ account }) => account === name);

// `ViewAllAccounts` is granted to SupportProvider and inherited by
// AccountManager; `CreateAccount` is AccountManager-only (the write tier).
export const hasViewAllAccounts = (): boolean =>
  staffState.globalRoles.includes("SupportProvider") ||
  staffState.globalRoles.includes("AccountManager");

export const hasCreateAccount = (): boolean =>
  staffState.globalRoles.includes("AccountManager");

// --- Error envelopes, verbatim from the server ---

/** `login_required` for a missing/invalid JWT (`JwtInvalidException`). */
const authTokenInvalidResponse = () =>
  HttpResponse.json(
    {
      error: "AuthTokenInvalid",
      message: "Auth token invalid. Please log in again.",
    },
    { status: 401 },
  );

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

/** `ApiRequestError(message="Not found", code=404)` — GET/PATCH account. */
const accountNotFoundResponse = () =>
  HttpResponse.json(
    { error: "ApiRequestError", message: "Not found", detail: null },
    { status: 404 },
  );

/** The generic `NotFound` — used by the WSL feature limits handlers. */
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
const SUBDOMAIN_MAX_LENGTH = 63;

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

// A single DNS label, per RFC 1034 section 3.1 (1–63 characters).
const SUBDOMAIN_PATTERN = /^[a-z]([a-z0-9-]*[a-z0-9])?$/;

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
  { ge, le }: { ge?: number; le?: number },
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

interface AccountPatchBody {
  enabled_features?: number[];
  subdomain?: string | null;
  max_people_count?: number;
  max_attachment_size?: number;
  salesforce_account_key?: string | null;
}

export default [
  http.get(`${API_URL}accounts`, ({ request }) => {
    if (!request.headers.get("Authorization")) {
      return authTokenInvalidResponse();
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const rawLimit = url.searchParams.get("limit");
    const rawOffset = url.searchParams.get("offset");

    const limit =
      rawLimit === null ? STAFF_ACCOUNT_PAGE_DEFAULT_LIMIT : Number(rawLimit);
    const offset = rawOffset === null ? 0 : Number(rawOffset);

    const detail = [
      ...rangeErrors("limit", limit, {
        ge: 1,
        le: STAFF_ACCOUNT_PAGE_MAX_LIMIT,
      }),
      ...rangeErrors("offset", offset, { ge: 0 }),
    ];

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

  http.get<{ name: string }>(
    `${API_URL}accounts/:name`,
    ({ request, params }) => {
      if (!request.headers.get("Authorization")) {
        return authTokenInvalidResponse();
      }

      if (!hasViewAllAccounts()) {
        return unauthorizedAccessResponse();
      }

      const account = getStaffAccountByName(params.name);

      if (!account) {
        return accountNotFoundResponse();
      }

      return HttpResponse.json(account);
    },
  ),

  http.patch<{ name: string }, AccountPatchBody>(
    `${API_URL}accounts/:name`,
    async ({ request, params }) => {
      if (!request.headers.get("Authorization")) {
        return authTokenInvalidResponse();
      }

      const body = await request.json();
      const knownFeatureKeys = features.map(
        ({ database_key }) => database_key,
      );
      const detail: PydanticErrorDetail[] = [];

      if (body.enabled_features !== undefined) {
        body.enabled_features.forEach((key, index) => {
          if (!knownFeatureKeys.includes(key)) {
            detail.push({
              type: "value_error",
              loc: ["enabled_features", index],
              msg: `Value error, ${key} not in known FeatureFlag IDs.`,
            });
          }
        });
      }

      if (
        typeof body.subdomain === "string" &&
        (body.subdomain.length > SUBDOMAIN_MAX_LENGTH ||
          !SUBDOMAIN_PATTERN.test(body.subdomain))
      ) {
        detail.push({
          type: "string_pattern_mismatch",
          loc: ["subdomain"],
          msg: `String should match pattern '${SUBDOMAIN_PATTERN.source}'`,
        });
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

      if (
        body.salesforce_account_key !== undefined &&
        body.salesforce_account_key !== null
      ) {
        if (!isValidSalesforceAccountKey(body.salesforce_account_key)) {
          return apiRequestErrorResponse(SALESFORCE_ACCOUNT_KEY_ERROR);
        }

        const holder = staffAccounts.find(
          (other) =>
            other.account !== account.account &&
            other.salesforce_account_key === body.salesforce_account_key,
        );

        if (holder) {
          return apiRequestErrorResponse(
            `Salesforce account key is already used by account ${holder.company} (${holder.account}) `,
          );
        }
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
    ({ request, params }) => {
      if (!request.headers.get("Authorization")) {
        return authTokenInvalidResponse();
      }

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
      if (!request.headers.get("Authorization")) {
        return authTokenInvalidResponse();
      }

      const body = await request.json();

      const detail: PydanticErrorDetail[] = (
        [
          "max_windows_host_machines",
          "max_wsl_child_instances_per_host",
          "max_wsl_child_instance_profiles",
        ] as const
      )
        .filter((field) => body[field] === undefined)
        .map((field) => ({
          type: "missing",
          loc: [field],
          msg: "Field required",
        }));

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
];
