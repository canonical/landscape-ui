import { describe, expect, it } from "vitest";
import { API_URL, API_URL_OLD, API_VERSION } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { activityTypes } from "@/tests/mocks/activity";
import { instances } from "@/tests/mocks/instance";
import { STAFF_READS } from "./staffAccountResources";
import { setStaffGlobalRoles } from "./staffAccounts";

// Contract tests for the account-scoped staff reads: every route sits behind
// the staff gate and answers exactly like the customer endpoint it stands for.

const OK = 200;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const [{ id: INSTANCE_ID }] = instances;

/** A concrete request for each route: the path with its parameters filled in. */
const SAMPLE_PATHS: Record<string, string> = {
  computers: "computers?limit=20&offset=0",
  "computers/availability-zones": "computers/availability-zones",
  tags: "tags",
  "access-groups": "access-groups",
  "computers/:computerId": `computers/${INSTANCE_ID}`,
  activities: `activities?query=computer:id:${INSTANCE_ID}&limit=20&offset=0`,
  "activities/:id": "activities/1",
  "activity-types": "activity-types",
  "computers/:computerId/livepatch/kernel": `computers/${INSTANCE_ID}/livepatch/kernel`,
  "computers/:computerId/livepatch/info": `computers/${INSTANCE_ID}/livepatch/info`,
  usns: `usns?computer_ids=${INSTANCE_ID}&limit=20&offset=0`,
  "usns/:usnName": `usns/6557-1?computer_ids=${INSTANCE_ID}`,
  "computers/:computerId/packages/search": `computers/${INSTANCE_ID}/packages/search?installed=true&limit=20&offset=0`,
  "computers/:computerId/snaps/installed": `computers/${INSTANCE_ID}/snaps/installed?limit=20&offset=0`,
  "computers/:computerId/processes": `computers/${INSTANCE_ID}/processes?limit=20&offset=0`,
  users: `users?computer_id=${INSTANCE_ID}`,
  "computers/:computerId/groups": `computers/${INSTANCE_ID}/groups`,
  "computers/:computerId/users/:username/groups": `computers/${INSTANCE_ID}/users/john/groups`,
  "computers/:computerId/children": `computers/${INSTANCE_ID}/children`,
};

const routes = STAFF_READS.map(({ path, legacyAction }) => ({
  path,
  legacyAction,
  sample: SAMPLE_PATHS[path] ?? "",
}));

const getStaff = async (account: string, path: string) =>
  fetch(`${API_URL}accounts/${account}/${path}`);

const getCustomer = async (path: string, legacyAction?: string) =>
  fetch(
    legacyAction
      ? `${API_URL_OLD}?action=${legacyAction}&version=${API_VERSION}`
      : `${API_URL}${path}`,
  );

describe("account-scoped staff reads", () => {
  it("has a sample request for every route", () => {
    expect(routes.filter(({ sample }) => !sample)).toEqual([]);
  });

  describe.each(routes)(
    "GET /accounts/:name/$path",
    ({ sample, legacyAction }) => {
      it("returns 403 for a non-staff caller, before the account lookup", async () => {
        const response = await getStaff("no-such-account", sample);

        expect(response.status).toBe(FORBIDDEN);
        expect(await response.json()).toEqual({
          error: "UnauthorizedAccess",
          message: "You do not have permission to perform this action.",
          detail: null,
        });
      });

      it("returns 404 for an unknown account", async () => {
        setStaffGlobalRoles(["SupportProvider"]);

        const response = await getStaff("no-such-account", sample);

        expect(response.status).toBe(NOT_FOUND);
        expect(await response.json()).toEqual({
          error: "NotFound",
          message: "Not found.",
          detail: null,
        });
      });

      it("answers read-tier staff like the customer endpoint", async () => {
        setStaffGlobalRoles(["SupportProvider"]);

        const [staff, customer] = await Promise.all([
          getStaff("acme", sample),
          getCustomer(sample, legacyAction),
        ]);

        expect(staff.status).toBe(OK);
        expect(await staff.json()).toEqual(await customer.json());
      });
    },
  );

  it("serves write-tier staff too", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    const response = await getStaff("acme", "computers?limit=20");

    expect(response.status).toBe(OK);
  });

  it("serves a disabled account", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await getStaff("initech", "tags");

    expect(response.status).toBe(OK);
  });

  it("returns no instances for an account that has none", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await getStaff("initech", "computers?limit=20&offset=0");

    expect(await response.json()).toEqual({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
  });

  it("passes the query on to the customer endpoint", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const response = await getStaff(
      "acme",
      "computers?query=access-group:singular-access-group&limit=20",
    );

    const { results } = await response.json();
    expect(results.map(({ id }: { id: number }) => id)).toEqual([INSTANCE_ID]);
  });

  it("returns the instance the path names", async () => {
    setStaffGlobalRoles(["SupportProvider"]);
    const [, second] = instances;

    const response = await getStaff("acme", `computers/${second.id}`);

    expect((await response.json()).id).toBe(second.id);
  });

  it("serves the legacy reads as V2 paths with the action's body", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const groups = await getStaff("acme", "access-groups");
    const types = await getStaff("acme", "activity-types");

    expect(await groups.json()).toEqual(accessGroups);
    expect(await types.json()).toEqual(activityTypes);
  });

  it("passes a list on to a legacy read in its indexed form", async () => {
    setStaffGlobalRoles(["SupportProvider"]);
    const [, { name }] = accessGroups;

    const response = await getStaff("acme", `access-groups?names=${name}`);

    expect(await response.json()).toEqual([accessGroups[1]]);
  });

  it("follows the endpoint status set for the customer path", async () => {
    setStaffGlobalRoles(["SupportProvider"]);
    setEndpointStatus({ status: "empty", path: "computers" });

    const response = await getStaff("acme", "computers?limit=20");

    expect((await response.json()).results).toEqual([]);
  });

  it("follows the endpoint status for an account with no instances too", async () => {
    setStaffGlobalRoles(["SupportProvider"]);
    setEndpointStatus({ status: "error", path: "computers" });

    const response = await getStaff("initech", "computers?limit=20");

    expect(response.status).toBe(SERVER_ERROR);
  });

  it("has no writes: a mutation under the prefix is an unhandled request", async () => {
    setStaffGlobalRoles(["AccountManager"]);

    await expect(
      fetch(`${API_URL}accounts/acme/computers/${INSTANCE_ID}/restart`, {
        method: "POST",
      }),
    ).rejects.toThrow();
  });
});
