import { describe, it, expect } from "vitest";
import {
  ALERT_TYPES,
  LICENSE_TYPES,
  USG_STATUSES,
  WSL_STATUSES,
} from "../constants";
import {
  validateSearchQuery,
  validateSearchField,
} from "./searchQueryValidation";

describe("validateSearchQuery", () => {
  it("handles typing vs finished tokens and per-key rules", () => {
    expect(validateSearchQuery("alert:compu")).toBeUndefined();

    expect(validateSearchQuery("alert:compu ")).toBe(
      '"alert" has invalid value "compu".',
    );

    const [validAlert] = ALERT_TYPES;
    expect(validateSearchQuery(`alert:${validAlert} `)).toBeUndefined();

    expect(validateSearchQuery("foo:bar ")).toBe(
      '"foo" is not a valid query key.',
    );

    expect(validateSearchQuery("id:123 ")).toBeUndefined();
    expect(validateSearchQuery("id:not-a-number ")).toBe(
      '"id" requires a number.',
    );

    const [validLicense] = LICENSE_TYPES;
    expect(
      validateSearchQuery(`license-type:${validLicense} `),
    ).toBeUndefined();
    expect(validateSearchQuery("license-type:enterprise ")).toBe(
      '"license-type" has invalid value "enterprise".',
    );

    expect(validateSearchQuery("has-pro-management:true ")).toBeUndefined();
    expect(validateSearchQuery("has-pro-management:0 ")).toBeUndefined();
    expect(validateSearchQuery("has-pro-management:maybe ")).toBe(
      '"has-pro-management" must be "true", "false", "1", or "0".',
    );

    expect(validateSearchQuery("needs:reboot ")).toBeUndefined();
    expect(validateSearchQuery("needs:license ")).toBeUndefined();
    expect(validateSearchQuery("needs:other ")).toBe(
      '"needs" has invalid value "other".',
    );
  });

  it("validates profile tokens and statuses", () => {
    const [validUsgStatus] = USG_STATUSES;
    const [validWslStatus] = WSL_STATUSES;

    expect(validateSearchQuery("profile:script:42 ")).toBeUndefined();

    expect(validateSearchQuery("profile:unknown:1 ")).toBe(
      '"profile" has invalid profile type "unknown".',
    );

    expect(validateSearchQuery("profile:script: ")).toBe(
      '"profile" requires an ID.',
    );

    expect(validateSearchQuery("profile:script:not-a-number ")).toBe(
      '"profile" ID must be a number.',
    );

    expect(validateSearchQuery("profile:security:1 ")).toBe(
      '"profile:security" requires a status.',
    );

    expect(validateSearchQuery("profile:security:1:foo ")).toBe(
      '"profile:security" has invalid security status "foo".',
    );

    expect(
      validateSearchQuery(`profile:security:1:${validUsgStatus} `),
    ).toBeUndefined();

    expect(validateSearchQuery("profile:wsl:1:foo ")).toBe(
      '"profile:wsl" has invalid WSL status "foo".',
    );

    expect(
      validateSearchQuery(`profile:wsl:1:${validWslStatus} `),
    ).toBeUndefined();
  });

  it("handles logical operators", () => {
    expect(validateSearchQuery("AND alert:package-upgrades ")).toBe(
      '"AND" cannot start a query.',
    );
    expect(validateSearchQuery("OR alert:package-upgrades ")).toBe(
      '"OR" cannot start a query.',
    );

    const [validAlert] = ALERT_TYPES;
    expect(validateSearchQuery(`NOT alert:${validAlert} `)).toBeUndefined();

    expect(
      validateSearchQuery(`hostname:foo AND alert:${validAlert} `),
    ).toBeUndefined();

    expect(validateSearchQuery(undefined)).toBeUndefined();
    expect(validateSearchQuery("   ")).toBeUndefined();
  });
});

describe("validateSearchField", () => {
  it("distinguishes typing vs strict modes", () => {
    const [validAlert] = ALERT_TYPES;

    expect(
      validateSearchField(`alert:${validAlert} AND alert:compu`, "typing"),
    ).toBeUndefined();

    expect(
      validateSearchField(`alert:${validAlert} AND alert:compu`, "strict"),
    ).toBe('"alert" has invalid value "compu".');

    expect(validateSearchField("", "typing")).toBe("This field is required.");
    expect(validateSearchField("   ", "strict")).toBe(
      "This field is required.",
    );
  });
});
