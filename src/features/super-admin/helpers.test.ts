import { ROUTES } from "@/libs/routes";
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { SUPPORT_PROFILE_PAGES, SUPPORT_SETTINGS_PAGES } from "./constants";
import {
  getDuplicateEmails,
  getErrorMessage,
  getSupportSessionNavigation,
  parseServerDateTime,
  toStaffPeopleResultType,
} from "./helpers";
import type { StaffPeopleResult } from "./types";

const getRejection = (data: unknown): AxiosError =>
  new AxiosError("Request failed", "ERR_BAD_RESPONSE", undefined, undefined, {
    data,
    status: 503,
    statusText: "Service Unavailable",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

const person = (
  id: number,
  email: string,
): Extract<StaffPeopleResult, { type: "person" }> => ({
  type: "person",
  id,
  name: "Someone",
  email,
  identity: null,
  last_login_time: null,
  accounts: [],
  pending_invitations: [],
});

const invitation = (
  id: number,
  email: string,
): Extract<StaffPeopleResult, { type: "invitation" }> => ({
  type: "invitation",
  id,
  name: "Someone",
  email,
  account: "acme",
  company: "Acme",
  salesforce_key: null,
  creation_time: "2026-01-01T00:00:00",
});

describe("getErrorMessage", () => {
  it("prefers the server's message", () => {
    expect(
      getErrorMessage(
        getRejection({ error: "Unavailable", message: "Try again later." }),
      ),
    ).toBe("Try again later.");
  });

  it("falls back to the error's own message", () => {
    expect(getErrorMessage(getRejection({ error: "Unavailable" }))).toBe(
      "Request failed",
    );
    expect(getErrorMessage(new Error("Boom"))).toBe("Boom");
  });

  it("describes anything that is not an error as unknown", () => {
    expect(getErrorMessage("Boom")).toBe("Unknown error");
    expect(getErrorMessage(undefined)).toBe("Unknown error");
  });
});

describe("getSupportSessionNavigation", () => {
  const [eventsLog, profiles, settings] = getSupportSessionNavigation("acme");

  it("opens with the events log, then the profile and settings groups", () => {
    expect(eventsLog).toEqual({
      label: "Events log",
      icon: "status",
      path: ROUTES.superAdmin.sessionEventsLog("acme"),
    });
    expect(profiles?.label).toBe("Profiles");
    expect(settings?.label).toBe("Org. settings");
  });

  it("lists every profile and settings page of the account", () => {
    expect(profiles?.items?.map(({ label }) => label)).toEqual(
      SUPPORT_PROFILE_PAGES.map(({ label }) => label),
    );
    expect(settings?.items?.map(({ label }) => label)).toEqual(
      SUPPORT_SETTINGS_PAGES.map(({ label }) => label),
    );
    expect(profiles?.items).toContainEqual({
      label: "Package profiles",
      path: ROUTES.superAdmin.sessionProfile("acme", "package"),
    });
    expect(settings?.items).toContainEqual({
      label: "Administrators",
      path: ROUTES.superAdmin.sessionSetting("acme", "administrators"),
    });
  });
});

describe("toStaffPeopleResultType", () => {
  it("passes the server's values through and drops anything else", () => {
    expect(toStaffPeopleResultType("person")).toBe("person");
    expect(toStaffPeopleResultType("invitation")).toBe("invitation");
    expect(toStaffPeopleResultType("")).toBeUndefined();
    expect(toStaffPeopleResultType("all")).toBeUndefined();
  });
});

describe("getDuplicateEmails", () => {
  it("returns the emails shared by two or more people, ignoring case", () => {
    expect(
      getDuplicateEmails([
        person(1, "jane@acme.com"),
        person(2, "Jane@acme.com"),
        person(3, "hank@globex.com"),
        person(4, "milton@initech.com"),
        person(5, "milton@initech.com"),
        person(6, "milton@initech.com"),
      ]),
    ).toEqual(new Set(["jane@acme.com", "milton@initech.com"]));
  });

  it("does not count invitations", () => {
    expect(
      getDuplicateEmails([
        person(1, "jane@acme.com"),
        invitation(2, "jane@acme.com"),
        invitation(3, "peter@initech.com"),
        invitation(4, "peter@initech.com"),
      ]),
    ).toEqual(new Set());
  });
});

describe("parseServerDateTime", () => {
  it("reads a timestamp without a zone as UTC", () => {
    expect(
      parseServerDateTime("2026-08-30T15:00:00.284113").toISOString(),
    ).toBe("2026-08-30T15:00:00.284Z");
    expect(parseServerDateTime("2026-08-30 15:00").toISOString()).toBe(
      "2026-08-30T15:00:00.000Z",
    );
  });

  it("leaves a timestamp with a zone alone", () => {
    expect(parseServerDateTime("2026-08-30T15:00:00Z").toISOString()).toBe(
      "2026-08-30T15:00:00.000Z",
    );
    expect(parseServerDateTime("2026-08-30T15:00:00+02:00").toISOString()).toBe(
      "2026-08-30T13:00:00.000Z",
    );
  });
});
