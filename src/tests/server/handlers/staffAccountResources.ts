import type { HttpHandler } from "msw";
import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import type { StaffAccount } from "@/features/super-admin";
import { generatePaginatedResponse } from "./_helpers";
import accessGroup from "./accessGroup";
import activity from "./activity";
import availabilityZones from "./availabilityZones";
import instance from "./instance";
import kernel from "./kernel";
import packages from "./packages";
import process from "./process";
import snap from "./snap";
import { resolveStaffAccount } from "./staffAccounts";
import tag from "./tag";
import user from "./user";
import usn from "./usn";
import wsl from "./wsl";

// The account-scoped staff (super admin) reads: what Canonical staff see of a
// customer account without switching into it. The account is in the path and
// the gate is the staff read tier, so nothing here depends on the caller's own
// session.
//
//   GET {API_URL}accounts/:name/<path>
//
// Each route answers exactly like the customer endpoint at `<path>` (same
// query parameters, same body), so the customer types and fixtures apply as
// they are. A route is forwarded to the customer handler for that path once
// the gate passes, which also means `setEndpointStatus` scenarios for the
// customer path apply here.
//
// Only reads are listed. A write under the prefix is an unhandled request and
// fails the test that sent it. To add a staff action, register it explicitly
// with `resolveStaffAccount(name, <write-tier check>)`.
//
// The backend for these routes does not exist yet; this file is the contract
// the UI is built against.

const LEGACY_API_VERSION = "2011-08-01";

interface StaffRead {
  /** The customer path, relative to `API_URL`, in MSW's `:param` syntax. */
  readonly path: string;
  /** The customer handlers that serve `path`. */
  readonly handlers: readonly HttpHandler[];
  /**
   * The legacy action `path` stands for, when the customer app reads this
   * through the legacy API. The staff route is a V2 path with the action's
   * response body.
   */
  readonly legacyAction?: string;
  /** Answers from the account itself, before the customer handlers are tried. */
  readonly respond?: (
    account: StaffAccount,
    request: Request,
  ) => Response | undefined;
}

const emptyPage = (request: Request): Response => {
  const { searchParams } = new URL(request.url);

  return HttpResponse.json(
    generatePaginatedResponse({
      data: [],
      limit: Number(searchParams.get("limit")) || undefined,
      offset: Number(searchParams.get("offset")) || 0,
    }),
  );
};

// Static paths come before the parameterized ones they would otherwise match.
export const STAFF_READS: readonly StaffRead[] = [
  // Instances list
  {
    path: "computers",
    handlers: instance,
    respond: (account, request) =>
      account.computers ? undefined : emptyPage(request),
  },
  { path: "computers/availability-zones", handlers: availabilityZones },
  { path: "tags", handlers: tag },
  {
    path: "access-groups",
    handlers: accessGroup,
    legacyAction: "GetAccessGroups",
  },

  // Single instance: the page itself, and the Info, Ubuntu Pro and Hardware tabs
  { path: "computers/:computerId", handlers: instance },

  // Activities tab
  { path: "activities", handlers: activity },
  { path: "activities/:id", handlers: activity },
  {
    path: "activity-types",
    handlers: activity,
    legacyAction: "GetActivityTypes",
  },

  // Kernel tab
  { path: "computers/:computerId/livepatch/kernel", handlers: kernel },
  { path: "computers/:computerId/livepatch/info", handlers: kernel },

  // Security issues tab
  { path: "usns", handlers: usn },
  { path: "usns/:usnName", handlers: usn },

  // Packages tab
  { path: "computers/:computerId/packages/search", handlers: packages },

  // Snaps tab
  { path: "computers/:computerId/snaps/installed", handlers: snap },

  // Processes tab
  { path: "computers/:computerId/processes", handlers: process },

  // Users tab
  { path: "users", handlers: user },
  { path: "computers/:computerId/groups", handlers: instance },
  {
    path: "computers/:computerId/users/:username/groups",
    handlers: instance,
  },

  // WSL tab (the limits are `accounts/:name/wsl-feature-limits`)
  { path: "computers/:computerId/children", handlers: wsl },
];

/** The customer request a staff request stands for. */
const toCustomerRequest = (
  request: Request,
  legacyAction?: string,
): Request => {
  const url = new URL(request.url);

  if (legacyAction) {
    const legacyUrl = new URL(API_URL_OLD, url);

    legacyUrl.search = url.search;
    legacyUrl.searchParams.set("action", legacyAction);
    legacyUrl.searchParams.set("version", LEGACY_API_VERSION);

    return new Request(legacyUrl, { headers: request.headers });
  }

  url.pathname = url.pathname.replace(/\/accounts\/[^/]+\//, "/");

  return new Request(url, { headers: request.headers });
};

const toHandler = ({
  path,
  handlers,
  legacyAction,
  respond,
}: StaffRead): HttpHandler =>
  http.get<{ name: string }>(
    `${API_URL}accounts/:name/${path}`,
    async ({ request, requestId, params }) => {
      const gate = resolveStaffAccount(params.name);

      if ("rejection" in gate) {
        return gate.rejection;
      }

      const own = respond?.(gate.account, request);

      if (own) {
        return own;
      }

      for (const handler of handlers) {
        const result = await handler.run({
          request: toCustomerRequest(request, legacyAction),
          requestId,
        });

        if (result?.response) {
          return result.response;
        }
      }

      // No customer handler answered (e.g. a non-numeric computer id), so the
      // request moves on to the next matching handler.
      return undefined;
    },
  );

export default STAFF_READS.map(toHandler);
