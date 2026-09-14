import { describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import { setStaffGlobalRoles } from "./staffAccounts";

// Contract tests for the staff (super admin) MSW handlers. These pin the
// mocks to the real V2 API's behavior — status codes, error envelopes and
// check ordering — since API e2e tests will run the same flows against the
// real backend and any divergence will surface there.

const AUTH_HEADERS = { Authorization: "Bearer test-account-token" };

const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
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
  it("returns 401 with the JWT error envelope without an auth header", async () => {
    const response = await get("accounts");

    expect(response.status).toBe(UNAUTHORIZED);
    expect(await response.json()).toEqual({
      error: "AuthTokenInvalid",
      message: "Auth token invalid. Please log in again.",
    });
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
    expect(count).toBe(5);
    expect(results.map(({ account }: { account: string }) => account)).toEqual(
      ["acme", "globex", "initech", "second-account", "test-account"],
    );
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
    ["account name", "acme", ["acme"]],
    ["title", "globex corp", ["globex"]],
    ["subdomain", "acme", ["acme"]],
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
    expect(count).toBe(5);
    expect(results.map(({ account }: { account: string }) => account)).toEqual(
      ["initech", "second-account"],
    );
  });

  it.each([["limit=0"], ["limit=101"], ["offset=-1"], ["limit=abc"]])(
    "rejects %s with a 400 validation envelope, before the staff check",
    async (params) => {
      const response = await get(`accounts?${params}`, AUTH_HEADERS);

      expect(response.status).toBe(BAD_REQUEST);
      const body = await response.json();
      expect(body.error).toBe("PydanticValidationError");
      expect(body.message).toBe("invalid query/body arguments");
      expect(body.detail.length).toBeGreaterThan(0);
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
        { name: "Jane Doe", email: "jane@acme.com", openid: null },
      ],
      licenses: [
        { expires: "2027-01-01T00:00:00Z", seats: 50, type: "UbuntuPro" },
      ],
      enabled_features: [4, 7],
      max_people_count: 10,
      max_attachment_size: 1048576,
    });
  });

  it("includes disabled_reason only for disabled accounts", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const disabled = await (await get("accounts/initech", AUTH_HEADERS)).json();
    expect(disabled).toMatchObject({
      disabled: true,
      disabled_reason: "Payment overdue",
    });

    const enabled = await (await get("accounts/acme", AUTH_HEADERS)).json();
    expect(enabled.disabled).toBe(false);
    expect(enabled).not.toHaveProperty("disabled_reason");
  });

  it("returns 403 before 404: an unauthorized caller cannot probe names", async () => {
    const response = await get("accounts/no-such-account", AUTH_HEADERS);

    expect(response.status).toBe(FORBIDDEN);
  });

  it("returns 404 for staff naming an unknown account", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await get("accounts/no-such-account", AUTH_HEADERS);

    expect(response.status).toBe(NOT_FOUND);
    expect(await response.json()).toEqual({
      error: "ApiRequestError",
      message: "Not found",
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
  it("is empty for a non-staff user and reflects granted roles for staff", async () => {
    const nonStaff = await (await get("me", AUTH_HEADERS)).json();
    expect(nonStaff.global_roles).toEqual([]);

    setStaffGlobalRoles(["AccountManager", "SupportProvider"]);

    const staff = await (await get("me", AUTH_HEADERS)).json();
    expect(staff.global_roles).toEqual(["AccountManager", "SupportProvider"]);
  });
});
