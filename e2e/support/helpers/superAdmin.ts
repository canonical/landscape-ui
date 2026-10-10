import type { Page, Route } from "@playwright/test";
import type {
  StaffAccount,
  StaffAccountListItem,
  StaffInvitationResult,
  StaffPeopleResult,
  StaffPersonResult,
  WslFeatureLimits,
} from "@/features/super-admin";
import {
  createStaffAccounts,
  defaultWslFeatureLimits,
  staffInvitations,
  staffPeople,
} from "@/tests/mocks/staffAccounts";

// The backends the suite runs against are standalone deployments: nobody
// there holds a global role, and the staff endpoints answer 403. The staff
// mock keeps the real session (login, `me`, the account's own data) and lays
// the staff tier over it: the person's global roles on the auth responses,
// an in-memory deployment behind the staff endpoints, and `switch-account`
// into any of its accounts. The deployment is the unit tests' fixture, so
// the two layers describe the same accounts and people.

export type StaffGlobalRole = "AccountManager" | "SupportProvider";

export interface StaffApiMockOptions {
  /** `AccountManager` (the write tier) unless given. */
  globalRoles?: StaffGlobalRole[];
  /** Hide the person's own accounts: staff who only ever work in super admin mode. */
  withoutOwnAccounts?: boolean;
}

export interface StaffApiMock {
  /** The deployment's accounts; the PATCH and WSL handlers mutate them in place. */
  accounts: StaffAccount[];
  /** The real session's own account, from its first auth response; `null` until then. */
  ownAccount: string | null;
  /** The names of the real session's own accounts, from its first auth response. */
  ownAccounts: string[];
  /** The `account_name` of every `POST switch-account`, in order. */
  switches: string[];
  /** The body of every `PATCH accounts/:name`, in order. */
  patches: Record<string, unknown>[];
}

const DEFAULT_PAGE_SIZE = 25;

const API_PATH = "/api/v2/";

const apiRoute = (path: string): RegExp =>
  new RegExp(`${API_PATH.replaceAll("/", "\\/")}${path}(\\?.*)?$`);

/** `text` parsed as JSON, or `undefined` when it is not JSON. */
const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const NOT_FOUND_STATUS = 404;

const json = async (route: Route, body: unknown) =>
  route.fulfill({ json: body });

const notFound = async (route: Route) =>
  route.fulfill({
    status: NOT_FOUND_STATUS,
    json: { error: "NotFound", message: "Not found.", detail: null },
  });

const FORBIDDEN_STATUS = 403;

// Writing an account takes the account manager tier, as on the server.
const forbidden = async (route: Route) =>
  route.fulfill({
    status: FORBIDDEN_STATUS,
    json: {
      error: "UnauthorizedAccess",
      message: "You do not have permission to perform this action.",
      detail: null,
    },
  });

const paginate = <T>(items: T[], url: URL) => {
  const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
  const offset = Number(url.searchParams.get("offset")) || 0;

  return {
    count: items.length,
    next: null,
    previous: null,
    results: items.slice(offset, offset + limit),
  };
};

/** The `:name` of an `accounts/:name` URL, or `""`. */
const accountName = (url: string): string =>
  decodeURIComponent(
    new URL(url).pathname.match(/\/accounts\/([^/]+)/)?.[1] ?? "",
  );

const toListItem = ({
  account,
  company,
  subdomain,
  disabled,
  computers,
  creation_time,
  salesforce_account_key,
  enabled_features,
  lds_enabled,
}: StaffAccount): StaffAccountListItem => ({
  account,
  company,
  subdomain,
  disabled,
  computers,
  creation_time,
  salesforce_account_key,
  enabled_features,
  lds_enabled,
});

const includesIgnoringCase = (value: string | null, search: string) =>
  !!value && value.toLowerCase().includes(search.toLowerCase());

const matchesAccountSearch = (account: StaffAccount, search: string) =>
  [
    account.account,
    account.company,
    account.subdomain,
    account.salesforce_account_key,
    ...account.administrators.flatMap(({ name, email }) => [name, email]),
  ].some((value) => includesIgnoringCase(value, search));

const searchPeople = (
  accounts: StaffAccount[],
  search: string,
  type: string | null,
): StaffPeopleResult[] => {
  const invitations = staffInvitations.flatMap((invitation) => {
    const target = accounts.find(
      ({ account }) => account === invitation.account,
    );

    return target ? [{ ...invitation, company: target.company }] : [];
  });

  const people: StaffPersonResult[] =
    type === "invitation"
      ? []
      : staffPeople
          .filter(
            ({ name, email }) =>
              includesIgnoringCase(name, search) ||
              includesIgnoringCase(email, search),
          )
          .map((person) => ({
            type: "person",
            id: person.id,
            name: person.name,
            email: person.email,
            identity: person.identity,
            last_login_time: person.last_login_time,
            accounts: accounts
              .filter(({ account }) => person.accounts.includes(account))
              .map(({ account, company, salesforce_account_key }) => ({
                account,
                company,
                salesforce_account_key,
              })),
            pending_invitations: invitations
              .filter(
                ({ email }) =>
                  email.toLowerCase() === person.email.toLowerCase(),
              )
              .map(({ account, company, creation_time }) => ({
                account,
                company,
                creation_time,
              })),
          }));

  const invited: StaffInvitationResult[] =
    type === "person"
      ? []
      : invitations
          .filter(
            ({ name, email, salesforce_key }) =>
              includesIgnoringCase(name, search) ||
              includesIgnoringCase(email, search) ||
              salesforce_key === search,
          )
          .map((invitation) => ({
            type: "invitation",
            id: invitation.id,
            name: invitation.name,
            email: invitation.email,
            account: invitation.account,
            company: invitation.company,
            salesforce_key: invitation.salesforce_key,
            creation_time: invitation.creation_time,
          }));

  return [...people, ...invited].sort(
    (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()) ||
      a.type.localeCompare(b.type) ||
      a.id - b.id,
  );
};

/**
 * Lays the staff tier over the real session for every request `page` makes
 * from now on. Install it before logging in: the login response carries the
 * global roles too.
 */
export async function mockStaffApi(
  page: Page,
  {
    globalRoles = ["AccountManager"],
    withoutOwnAccounts = false,
  }: StaffApiMockOptions = {},
): Promise<StaffApiMock> {
  const mock: StaffApiMock = {
    accounts: createStaffAccounts(),
    ownAccount: null,
    ownAccounts: [],
    switches: [],
    patches: [],
  };

  const wslLimits: Record<string, WslFeatureLimits> = {};

  // The account the session was last switched into, once that is one of
  // the mock's: the real server knows nothing about it.
  let enteredAccount: string | null = null;

  const findAccount = (name: string) =>
    mock.accounts.find(({ account }) => account === name);

  // The auth responses: the real person, with the staff roles added.
  const withStaffRoles = async (route: Route) => {
    const response = await route.fetch();
    const body = parseJson(await response.text());

    // Anything but a signed-in person (a rejected login, an expired
    // session) goes through untouched.
    if (
      typeof body !== "object" ||
      body === null ||
      !("current_account" in body)
    ) {
      await route.fulfill({ response });
      return;
    }

    if (!enteredAccount && typeof body.current_account === "string") {
      mock.ownAccount = body.current_account;
    }

    if (!enteredAccount && "accounts" in body && Array.isArray(body.accounts)) {
      mock.ownAccounts = body.accounts.flatMap((account: unknown) =>
        typeof account === "object" &&
        account !== null &&
        "name" in account &&
        typeof account.name === "string"
          ? [account.name]
          : [],
      );
    }

    await route.fulfill({
      response,
      json: {
        ...body,
        global_roles: globalRoles,
        ...(withoutOwnAccounts && { accounts: [] }),
        ...(enteredAccount && { current_account: enteredAccount }),
      },
    });
  };

  await page.route(apiRoute("login"), async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }

    await withStaffRoles(route);
  });

  await page.route(apiRoute("me"), withStaffRoles);

  await page.route(apiRoute("switch-account"), async (route) => {
    const { account_name: name } = route.request().postDataJSON() as {
      account_name: string;
    };

    mock.switches.push(name);

    // One of the person's own accounts, or none the deployment knows: the
    // real server switches, or refuses.
    if (mock.ownAccounts.includes(name) || !findAccount(name)) {
      enteredAccount = null;
      await route.continue();
      return;
    }

    // Entering an account one is not a member of takes the support tier,
    // as on the server.
    if (!globalRoles.includes("SupportProvider")) {
      await route.fulfill({
        status: 400,
        json: {
          error: "UnknownAccountError",
          message: "The specified account couldn't be found.",
        },
      });
      return;
    }

    // The session keeps its real token: the account's pages then show the
    // person's own data, which is all a standalone backend can serve.
    const authorization = route.request().headers().authorization ?? "";

    enteredAccount = name;

    await json(route, { token: authorization.replace(/^Bearer /, "") });
  });

  await page.route(apiRoute("accounts"), async (route) => {
    const url = new URL(route.request().url());
    const search = url.searchParams.get("search");

    const matching = search
      ? mock.accounts.filter((account) => matchesAccountSearch(account, search))
      : mock.accounts;

    await json(route, paginate(matching.map(toListItem), url));
  });

  await page.route(apiRoute("accounts/([^/?]+)"), async (route) => {
    const request = route.request();
    const account = findAccount(accountName(request.url()));

    if (!account) {
      await notFound(route);
      return;
    }

    if (request.method() === "PATCH") {
      if (!globalRoles.includes("AccountManager")) {
        await forbidden(route);
        return;
      }

      const body = request.postDataJSON() as Partial<StaffAccount>;

      mock.patches.push(body);
      Object.assign(account, body);
    }

    await json(route, account);
  });

  await page.route(
    apiRoute("accounts/([^/?]+)/wsl-feature-limits"),
    async (route) => {
      const request = route.request();
      const name = accountName(request.url());

      if (!findAccount(name)) {
        await notFound(route);
        return;
      }

      if (request.method() === "POST") {
        if (!globalRoles.includes("AccountManager")) {
          await forbidden(route);
          return;
        }

        wslLimits[name] = request.postDataJSON() as WslFeatureLimits;
      }

      await json(route, wslLimits[name] ?? defaultWslFeatureLimits);
    },
  );

  await page.route(apiRoute("people"), async (route) => {
    const url = new URL(route.request().url());
    const search = url.searchParams.get("search") ?? "";

    await json(
      route,
      paginate(
        searchPeople(mock.accounts, search, url.searchParams.get("type")),
        url,
      ),
    );
  });

  return mock;
}
