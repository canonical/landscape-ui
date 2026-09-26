import { describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import { setCallerAccounts, setStaffGlobalRoles } from "./staffAccounts";

// Contract tests for the staff (super admin) MSW handlers. These pin the
// mocks to the real V2 API's behavior — status codes, error envelopes and
// check ordering — since API e2e tests will run the same flows against the
// real backend and any divergence will surface there.

// Sent like the app sends it. The staff handlers ignore it (see the handler
// module's header comment); `GET /me` uses it to pick the mock user.
const AUTH_HEADERS = { Authorization: "Bearer test-account-token" };

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const NEW_MAX_PEOPLE_COUNT = 25;
const UNKNOWN_FEATURE_KEY = 99;

const get = async (path: string, headers: Record<string, string> = {}) =>
  fetch(`${API_URL}${path}`, { headers });

const send = async (
  method: string,
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
) =>
  fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

describe("GET /accounts", () => {
  it("serves a request without an Authorization header, as the test providers send none", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts");

    expect(response.status).toBe(OK);
  });

  it("returns 403 for a non-staff caller", async () => {
    const response = await get("accounts", AUTH_HEADERS);

    expect(response.status).toBe(FORBIDDEN);
    expect(await response.json()).toEqual({
      error: "UnauthorizedAccess",
      message: "You do not have permission to perform this action.",
      detail: null,
    });
  });

  it("returns the slim projection, sorted by name, for read-tier staff", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts", AUTH_HEADERS);

    expect(response.status).toBe(OK);
    const { count, results } = await response.json();
    expect(count).toBe(6);
    expect(results.map(({ account }: { account: string }) => account)).toEqual([
      "acme",
      "globex",
      "initech",
      "jane-free-1",
      "second-account",
      "test-account",
    ]);
    expect(results[0]).toEqual({
      account: "acme",
      company: "ACME Corp",
      subdomain: "acme",
      disabled: false,
      computers: 41,
      creation_time: "2024-01-01T00:00:00Z",
      salesforce_account_key: "1-001A1B2C3D4E5F0",
      enabled_features: [4, 7],
      lds_enabled: false,
    });
    expect(results[0]).not.toHaveProperty("administrators");
    expect(results[0]).not.toHaveProperty("max_people_count");
  });

  it.each([
    ["account name", "free-1", ["jane-free-1"]],
    ["title", "globex corp", ["globex"]],
    ["subdomain", "janedoe", ["jane-free-1"]],
    ["salesforce key", "1-001A1B2C3D4E5F0", ["acme"]],
    ["administrator name", "lumbergh", ["initech"]],
    ["administrator email", "hank@globex.com", ["globex"]],
  ])("search matches by %s", async (_, search, expected) => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await get(
      `accounts?search=${encodeURIComponent(search)}`,
      AUTH_HEADERS,
    );

    const { count, results } = await response.json();
    expect(count).toBe(expected.length);
    expect(results.map(({ account }: { account: string }) => account)).toEqual(
      expected,
    );
  });

  it("paginates with limit and offset, counting all matches", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts?limit=2&offset=2", AUTH_HEADERS);

    const { count, results } = await response.json();
    expect(count).toBe(6);
    expect(results.map(({ account }: { account: string }) => account)).toEqual([
      "initech",
      "jane-free-1",
    ]);
  });

  it("accepts the integer forms the server's pydantic does", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts?limit=2.0&offset=1.", AUTH_HEADERS);

    expect(response.status).toBe(OK);
    const { results } = await response.json();
    expect(results.map(({ account }: { account: string }) => account)).toEqual([
      "globex",
      "initech",
    ]);
  });

  it.each([
    ["limit=0", { type: "greater_than", loc: ["limit"] }],
    ["limit=101", { type: "less_than_equal", loc: ["limit"] }],
    ["offset=-1", { type: "greater_than_equal", loc: ["offset"] }],
    ["limit=abc", { type: "int_parsing", loc: ["limit"] }],
    ["limit=0x10", { type: "int_parsing", loc: ["limit"] }],
    ["offset=", { type: "int_parsing", loc: ["offset"] }],
  ])(
    "rejects %s with a 400 validation envelope, before the staff check",
    async (params, expected) => {
      const response = await get(`accounts?${params}`, AUTH_HEADERS);

      expect(response.status).toBe(BAD_REQUEST);
      const body = await response.json();
      expect(body.error).toBe("PydanticValidationError");
      expect(body.message).toBe("invalid query/body arguments");
      expect(body.detail).toContainEqual(expect.objectContaining(expected));
    },
  );
});

describe("GET /accounts/:name", () => {
  it("returns the full detail for read-tier staff", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts/acme", AUTH_HEADERS);

    expect(response.status).toBe(OK);
    const account = await response.json();
    expect(account).toMatchObject({
      account: "acme",
      company: "ACME Corp",
      administrators: [
        {
          name: "Jane Doe",
          email: "jane@acme.com",
          openid: "https://login.ubuntu.com/+id/abc123",
        },
      ],
      licenses: [
        { expires: "2027-01-01T00:00:00Z", seats: 50, type: "UbuntuPro" },
      ],
      enabled_features: [4, 7],
      max_people_count: 10,
      max_attachment_size: 1048576,
    });
  });

  it("always includes disabled_reason, null unless the account is disabled", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const disabled = await (await get("accounts/initech", AUTH_HEADERS)).json();
    expect(disabled).toMatchObject({
      disabled: true,
      disabled_reason: "Payment overdue",
    });

    const enabled = await (await get("accounts/acme", AUTH_HEADERS)).json();
    expect(enabled).toMatchObject({ disabled: false, disabled_reason: null });
  });

  it("returns 403 before 404: an unauthorized caller cannot probe names", async () => {
    const response = await get("accounts/no-such-account", AUTH_HEADERS);

    expect(response.status).toBe(FORBIDDEN);
  });

  it("returns the NotFound envelope for staff naming an unknown account", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts/no-such-account", AUTH_HEADERS);

    expect(response.status).toBe(NOT_FOUND);
    expect(await response.json()).toEqual({
      error: "NotFound",
      message: "Not found.",
      detail: null,
    });
  });
});

describe("PATCH /accounts/:name", () => {
  it("returns 403 for read-tier staff (SupportProvider lacks CreateAccount)", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await send("PATCH", "accounts/acme", {}, AUTH_HEADERS);

    expect(response.status).toBe(FORBIDDEN);
  });

  it("merge-patches only the provided fields and persists them", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "PATCH",
      "accounts/globex",
      { max_people_count: NEW_MAX_PEOPLE_COUNT, subdomain: "globex" },
      AUTH_HEADERS,
    );

    expect(response.status).toBe(OK);
    expect(await response.json()).toMatchObject({
      account: "globex",
      max_people_count: NEW_MAX_PEOPLE_COUNT,
      subdomain: "globex",
      max_attachment_size: 1048576,
    });

    const persisted = await (await get("accounts/globex", AUTH_HEADERS)).json();
    expect(persisted.max_people_count).toBe(NEW_MAX_PEOPLE_COUNT);
    expect(persisted.subdomain).toBe("globex");
  });

  it("clears the Salesforce key and subdomain with explicit nulls", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "PATCH",
      "accounts/acme",
      { salesforce_account_key: null, subdomain: null },
      AUTH_HEADERS,
    );

    const account = await response.json();
    expect(account.salesforce_account_key).toBeNull();
    expect(account.subdomain).toBeNull();
  });

  it.each([
    ["an unknown feature key", { enabled_features: [UNKNOWN_FEATURE_KEY] }],
    ["an invalid subdomain", { subdomain: "-bad-" }],
    ["max_people_count above 100", { max_people_count: 101 }],
    ["max_people_count below 1", { max_people_count: 0 }],
    ["a negative max_attachment_size", { max_attachment_size: -1 }],
  ])("rejects %s with a 400 validation envelope", async (_, body) => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send("PATCH", "accounts/acme", body, AUTH_HEADERS);

    expect(response.status).toBe(BAD_REQUEST);
    expect((await response.json()).error).toBe("PydanticValidationError");
  });

  it.each([
    [
      "a non-array enabled_features",
      { enabled_features: 4 },
      { type: "list_type", loc: ["enabled_features"] },
    ],
    [
      "a non-string salesforce_account_key",
      { salesforce_account_key: 1001 },
      { type: "string_type", loc: ["salesforce_account_key"] },
    ],
    [
      "a non-string subdomain",
      { subdomain: 123 },
      { type: "string_type", loc: ["subdomain"] },
    ],
    [
      "an empty subdomain",
      { subdomain: "" },
      { type: "string_too_short", loc: ["subdomain"] },
    ],
    [
      "a subdomain over 63 characters",
      { subdomain: "a".repeat(64) },
      { type: "string_too_long", loc: ["subdomain"] },
    ],
    ["a null body", null, { type: "model_attributes_type", loc: ["body"] }],
    ["an array body", [], { type: "model_attributes_type", loc: ["body"] }],
  ])(
    "rejects %s with a 400 validation envelope rather than throwing",
    async (_, body, expected) => {
      setStaffGlobalRoles(["AccountManager"]);

      const response = await send("PATCH", "accounts/acme", body, AUTH_HEADERS);

      expect(response.status).toBe(BAD_REQUEST);
      const payload = await response.json();
      expect(payload.error).toBe("PydanticValidationError");
      expect(payload.detail).toContainEqual(expect.objectContaining(expected));
    },
  );

  it.each([
    [
      "a disallowed subdomain",
      { subdomain: "saas" },
      "Cannot set subdomain to any of '['landscape', 'saas']'",
    ],
    [
      "a subdomain another account uses",
      { subdomain: "acme" },
      "Subdomains must be unique across accounts; 'acme' already set on 'acme'",
    ],
  ])("rejects %s with the server's message", async (_, body, message) => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send("PATCH", "accounts/globex", body, AUTH_HEADERS);

    expect(response.status).toBe(BAD_REQUEST);
    expect(await response.json()).toEqual({
      error: "ApiRequestError",
      message,
      detail: null,
    });
  });

  it("applies nothing when a field is rejected, like the server's rollback", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "PATCH",
      "accounts/globex",
      { max_people_count: NEW_MAX_PEOPLE_COUNT, subdomain: "acme" },
      AUTH_HEADERS,
    );
    expect(response.status).toBe(BAD_REQUEST);

    const persisted = await (await get("accounts/globex", AUTH_HEADERS)).json();
    expect(persisted).toMatchObject({ max_people_count: 10, subdomain: null });
  });

  it("rejects a malformed Salesforce key with the server's message", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "PATCH",
      "accounts/globex",
      { salesforce_account_key: "not-a-key" },
      AUTH_HEADERS,
    );

    expect(response.status).toBe(BAD_REQUEST);
    const body = await response.json();
    expect(body.error).toBe("ApiRequestError");
    expect(body.message).toContain("Salesforce account keys must be");
  });

  it("rejects a Salesforce key already used by another account", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "PATCH",
      "accounts/globex",
      { salesforce_account_key: "1-001A1B2C3D4E5F0" },
      AUTH_HEADERS,
    );

    expect(response.status).toBe(BAD_REQUEST);
    expect((await response.json()).message).toContain(
      "already used by account ACME Corp (acme)",
    );
  });
});

describe("WSL feature limits", () => {
  it("GET returns the server defaults when unset", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get(
      "accounts/acme/wsl-feature-limits",
      AUTH_HEADERS,
    );

    expect(response.status).toBe(OK);
    expect(await response.json()).toEqual({
      max_windows_host_machines: 1000,
      max_wsl_child_instances_per_host: 10,
      max_wsl_child_instance_profiles: 100,
    });
  });

  it("GET returns the NotFound envelope for an unknown account", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get(
      "accounts/no-such-account/wsl-feature-limits",
      AUTH_HEADERS,
    );

    expect(response.status).toBe(NOT_FOUND);
    expect(await response.json()).toEqual({
      error: "NotFound",
      message: "Not found.",
      detail: null,
    });
  });

  it("POST requires all three limits", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "POST",
      "accounts/acme/wsl-feature-limits",
      { max_windows_host_machines: 500 },
      AUTH_HEADERS,
    );

    expect(response.status).toBe(BAD_REQUEST);
    const body = await response.json();
    expect(body.error).toBe("PydanticValidationError");
    expect(body.detail).toHaveLength(2);
  });

  it("POST rejects a null body with a 400 validation envelope rather than throwing", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "POST",
      "accounts/acme/wsl-feature-limits",
      null,
      AUTH_HEADERS,
    );

    expect(response.status).toBe(BAD_REQUEST);
    const body = await response.json();
    expect(body.error).toBe("PydanticValidationError");
    expect(body.detail).toContainEqual(
      expect.objectContaining({ type: "model_attributes_type", loc: ["body"] }),
    );
  });

  it("POST rejects a non-integer limit instead of storing it", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "POST",
      "accounts/acme/wsl-feature-limits",
      {
        max_windows_host_machines: "many",
        max_wsl_child_instances_per_host: 10,
        max_wsl_child_instance_profiles: 100,
      },
      AUTH_HEADERS,
    );

    expect(response.status).toBe(BAD_REQUEST);
    const body = await response.json();
    expect(body.error).toBe("PydanticValidationError");
    expect(body.detail).toContainEqual(
      expect.objectContaining({
        type: "int_parsing",
        loc: ["max_windows_host_machines"],
      }),
    );
  });

  it("POST is write-tier only and persists the new limits", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const limits = {
      max_windows_host_machines: 500,
      max_wsl_child_instances_per_host: 5,
      max_wsl_child_instance_profiles: 50,
    };

    const forbidden = await send(
      "POST",
      "accounts/acme/wsl-feature-limits",
      limits,
      AUTH_HEADERS,
    );
    expect(forbidden.status).toBe(FORBIDDEN);

    setStaffGlobalRoles(["AccountManager"]);

    const response = await send(
      "POST",
      "accounts/acme/wsl-feature-limits",
      limits,
      AUTH_HEADERS,
    );
    expect(response.status).toBe(OK);
    expect(await response.json()).toEqual(limits);

    const persisted = await get(
      "accounts/acme/wsl-feature-limits",
      AUTH_HEADERS,
    );
    expect(await persisted.json()).toEqual(limits);
  });
});

describe("GET /people", () => {
  const searchPeople = async (params: string) =>
    get(`people?${params}`, AUTH_HEADERS);

  const typesAndIds = (results: { type: string; id: number }[]) =>
    results.map(({ type, id }) => ({ type, id }));

  it("returns 403 for a non-staff caller", async () => {
    const response = await searchPeople("search=jane");

    expect(response.status).toBe(FORBIDDEN);
    expect((await response.json()).error).toBe("UnauthorizedAccess");
  });

  it.each([
    ["a missing search", "", { type: "missing", loc: ["search"] }],
    [
      "a search under 3 characters",
      "search=ja",
      { type: "string_too_short", loc: ["search"] },
    ],
    [
      "an unknown type",
      "search=jane&type=account",
      { type: "literal_error", loc: ["type"] },
    ],
    [
      "limit=0",
      "search=jane&limit=0",
      { type: "greater_than", loc: ["limit"] },
    ],
    [
      "limit=101",
      "search=jane&limit=101",
      { type: "less_than_equal", loc: ["limit"] },
    ],
    [
      "offset=-1",
      "search=jane&offset=-1",
      { type: "greater_than_equal", loc: ["offset"] },
    ],
  ])(
    "rejects %s with a 400 validation envelope, before the staff check",
    async (_, params, expected) => {
      const response = await searchPeople(params);

      expect(response.status).toBe(BAD_REQUEST);
      const body = await response.json();
      expect(body.error).toBe("PydanticValidationError");
      expect(body.detail).toContainEqual(expect.objectContaining(expected));
    },
  );

  it("lists people and invitations together, ordered by name, then type, then id", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await searchPeople("search=jane");

    expect(response.status).toBe(OK);
    const { count, results } = await response.json();
    expect(count).toBe(4);
    expect(typesAndIds(results)).toEqual([
      { type: "invitation", id: 913 },
      { type: "invitation", id: 914 },
      { type: "person", id: 4821 },
      { type: "person", id: 5107 },
    ]);
    expect(results[0]).toEqual({
      type: "invitation",
      id: 913,
      name: "Jane Doe",
      email: "jane.doe@acme.com",
      account: "acme",
      company: "ACME Corp",
      salesforce_key: null,
      creation_time: "2026-08-30T15:00:00.284113",
    });
    expect(results[2]).toEqual({
      type: "person",
      id: 4821,
      name: "Jane Doe",
      email: "jane@acme.com",
      identity: "https://login.ubuntu.com/+id/abc123",
      last_login_time: "2026-09-01T08:12:44.512934",
      accounts: [
        {
          account: "acme",
          company: "ACME Corp",
          salesforce_account_key: "1-001A1B2C3D4E5F0",
        },
        {
          account: "jane-free-1",
          company: "Jane's free account",
          salesforce_account_key: null,
        },
      ],
      pending_invitations: [
        {
          account: "globex",
          company: "Globex Corporation",
          creation_time: "2026-09-10T09:30:12.771020",
        },
      ],
    });
  });

  it("returns a duplicate record without identity or accounts, with the invitations to its email", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const { results } = await (
      await searchPeople("search=jane&type=person")
    ).json();

    // The invitation is addressed to `Jane@acme.com`: emails match regardless of case.
    expect(results[1]).toEqual({
      type: "person",
      id: 5107,
      name: "Jane Doe",
      email: "jane@acme.com",
      identity: null,
      last_login_time: null,
      accounts: [],
      pending_invitations: [
        {
          account: "globex",
          company: "Globex Corporation",
          creation_time: "2026-09-10T09:30:12.771020",
        },
      ],
    });
  });

  it.each([
    [
      "person",
      [
        { type: "person", id: 4821 },
        { type: "person", id: 5107 },
      ],
    ],
    [
      "invitation",
      [
        { type: "invitation", id: 913 },
        { type: "invitation", id: 914 },
      ],
    ],
  ])("restricts the results and count to type=%s", async (type, expected) => {
    setStaffGlobalRoles(["SupportProvider"]);

    const { count, results } = await (
      await searchPeople(`search=jane&type=${type}`)
    ).json();

    expect(count).toBe(expected.length);
    expect(typesAndIds(results)).toEqual(expected);
  });

  it("matches emails as substrings and returns orphaned people with no accounts", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const { count, results } = await (
      await searchPeople("search=initech")
    ).json();

    expect(count).toBe(3);
    expect(typesAndIds(results)).toEqual([
      { type: "person", id: 877 },
      { type: "person", id: 902 },
      { type: "invitation", id: 920 },
    ]);
    expect(results[1]).toMatchObject({
      name: "Milton Waddams",
      accounts: [],
      pending_invitations: [],
    });
  });

  it("matches an invitation's Salesforce key exactly, not as a substring", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const exact = await (await searchPeople("search=1-001P3T3RG1BB0N5")).json();
    expect(typesAndIds(exact.results)).toEqual([
      { type: "invitation", id: 920 },
    ]);

    const partial = await (await searchPeople("search=P3T3RG1BB0N5")).json();
    expect(partial.count).toBe(0);
  });

  it("paginates across both result types, counting all matches", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const { count, results } = await (
      await searchPeople("search=jane&limit=2&offset=1")
    ).json();

    expect(count).toBe(4);
    expect(typesAndIds(results)).toEqual([
      { type: "invitation", id: 914 },
      { type: "person", id: 4821 },
    ]);
  });

  it("reports memberships from the current account state", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    await send(
      "PATCH",
      "accounts/acme",
      { salesforce_account_key: null },
      AUTH_HEADERS,
    );

    const { results } = await (
      await searchPeople("search=jane&type=person")
    ).json();
    expect(results[0].accounts[0]).toEqual({
      account: "acme",
      company: "ACME Corp",
      salesforce_account_key: null,
    });
  });
});

describe("POST /switch-account", () => {
  const switchTo = async (account_name: string) =>
    send("POST", "switch-account", { account_name }, AUTH_HEADERS);

  const unknownAccountBody = {
    error: "UnknownAccountError",
    message: "The specified account couldn't be found.",
  };

  it("succeeds for a member regardless of staff roles", async () => {
    const response = await switchTo("second-account");

    expect(response.status).toBe(OK);
    expect(await response.json()).toEqual({ token: "second-account-token" });
  });

  it("returns the same non-disclosing 400 for unknown and non-member accounts", async () => {
    const unknown = await switchTo("no-such-account");
    expect(unknown.status).toBe(BAD_REQUEST);
    expect(await unknown.json()).toEqual(unknownAccountBody);

    const nonMember = await switchTo("acme");
    expect(nonMember.status).toBe(BAD_REQUEST);
    expect(await nonMember.json()).toEqual(unknownAccountBody);
  });

  it("honours a narrowed caller membership rather than the fixture union", async () => {
    setCallerAccounts(["second-account"]);

    const member = await switchTo("second-account");
    expect(member.status).toBe(OK);

    // `onward` is in the `accountsDefault` fixture but not in this caller's
    // membership, so it must still get the non-disclosing 400.
    const nonMember = await switchTo("onward");
    expect(nonMember.status).toBe(BAD_REQUEST);
    expect(await nonMember.json()).toEqual(unknownAccountBody);
  });

  it("lets SupportProvider staff enter a non-member account", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await switchTo("acme");

    expect(response.status).toBe(OK);
    expect(await response.json()).toEqual({ token: "acme-token" });
  });

  it("mirrors the server's literal SupportProvider check: AccountManager alone does not pass", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await switchTo("acme");

    expect(response.status).toBe(BAD_REQUEST);
  });

  it("staff bypass the target's re-authentication policy", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await switchTo("globex");

    expect(response.status).toBe(OK);
  });
});

describe("GET /me global_roles", () => {
  it("is empty for a non-staff user and lists staff roles sorted, as the server does", async () => {
    const nonStaff = await (await get("me", AUTH_HEADERS)).json();
    expect(nonStaff.global_roles).toEqual([]);

    setStaffGlobalRoles(["SupportProvider", "AccountManager"]);

    const staff = await (await get("me", AUTH_HEADERS)).json();
    expect(staff.global_roles).toEqual(["AccountManager", "SupportProvider"]);
  });
});
