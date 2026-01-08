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
import { useInstanceSearchHelpTerms } from "@/features/instances";
import { renderHook } from "@testing-library/react";
import { renderHookWithProviders } from "@/tests/render";

describe("validateSearchQuery", () => {
  it("validates keys using real hook data", () => {
    const { result } = renderHook(() => useInstanceSearchHelpTerms(), {
      wrapper: renderHookWithProviders(),
    });

    const terms = result.current;
    const keys = terms
      .filter((t) => t.term.includes(":"))
      .map((t) => t.term.split(":")[0]);

    keys.forEach((key) => {
      const error = validateSearchQuery(`${key}:dummy-value `);
      const isKeyInvalid = error === `"${key}" is not a valid query key.`;

      if (key === "search") {
        expect(isKeyInvalid, 'Expected "search" to be strictly rejected').toBe(
          true,
        );
      } else {
        expect(isKeyInvalid, `Expected key "${key}" to be recognized`).toBe(
          false,
        );
      }
    });
  });

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

    expect(validateSearchQuery("upgrade-profile:daily ")).toBeUndefined();
    expect(validateSearchQuery("removal-profile:2 ")).toBeUndefined();
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

describe("validateSearchQuery with ValidationConfig", () => {
  it("should accept profile types from config", () => {
    const config = {
      profileTypes: ["package", "removal"],
    };

    expect(
      validateSearchQuery("profile:package:1 ", false, config),
    ).toBeUndefined();
    expect(
      validateSearchQuery("profile:removal:1 ", false, config),
    ).toBeUndefined();
  });

  it("should reject profile types not in config", () => {
    const config = {
      profileTypes: ["package", "removal"],
    };

    expect(validateSearchQuery("profile:script:1 ", false, config)).toBe(
      '"profile" has invalid profile type "script".',
    );

    expect(validateSearchQuery("profile:security:1:pass ", false, config)).toBe(
      '"profile" has invalid profile type "security".',
    );

    expect(validateSearchQuery("profile:wsl:1:compliant ", false, config)).toBe(
      '"profile" has invalid profile type "wsl".',
    );
  });

  it("should accept USG statuses from config", () => {
    const config = {
      profileTypes: ["security"],
      usgStatuses: ["pass", "fail"],
    };

    expect(
      validateSearchQuery("profile:security:1:pass ", false, config),
    ).toBeUndefined();
    expect(
      validateSearchQuery("profile:security:1:fail ", false, config),
    ).toBeUndefined();
  });

  it("should reject USG statuses not in config", () => {
    const config = {
      profileTypes: ["security"],
      usgStatuses: ["pass"],
    };

    expect(validateSearchQuery("profile:security:1:fail ", false, config)).toBe(
      '"profile:security" has invalid security status "fail".',
    );

    expect(
      validateSearchQuery("profile:security:1:in-progress ", false, config),
    ).toBe('"profile:security" has invalid security status "in-progress".');
  });

  it("should accept WSL statuses from config", () => {
    const config = {
      profileTypes: ["wsl"],
      wslStatuses: ["compliant"],
    };

    expect(
      validateSearchQuery("profile:wsl:1:compliant ", false, config),
    ).toBeUndefined();
  });

  it("should reject WSL statuses not in config", () => {
    const config = {
      profileTypes: ["wsl"],
      wslStatuses: ["compliant"],
    };

    expect(
      validateSearchQuery("profile:wsl:1:noncompliant ", false, config),
    ).toBe('"profile:wsl" has invalid WSL status "noncompliant".');
  });

  it("should reject profile type when empty config provided", () => {
    const config = {
      profileTypes: [],
    };

    expect(validateSearchQuery("profile:package:1 ", false, config)).toBe(
      '"profile" has invalid profile type "package".',
    );
  });

  it("should use default values when no config provided", () => {
    expect(validateSearchQuery("profile:package:1 ")).toBeUndefined();
    expect(validateSearchQuery("profile:script:1 ")).toBeUndefined();
    expect(validateSearchQuery("profile:security:1:pass ")).toBeUndefined();
    expect(validateSearchQuery("profile:wsl:1:compliant ")).toBeUndefined();
  });
});

describe("validateSearchField with ValidationConfig", () => {
  it("should pass config through to validateSearchQuery in typing mode", () => {
    const config = {
      profileTypes: ["package"],
    };

    expect(
      validateSearchField("profile:package:1 ", "typing", config),
    ).toBeUndefined();

    expect(validateSearchField("profile:script:1 ", "typing", config)).toBe(
      '"profile" has invalid profile type "script".',
    );
  });

  it("should pass config through to validateSearchQuery in strict mode", () => {
    const config = {
      profileTypes: ["package"],
    };

    expect(
      validateSearchField("profile:package:1 ", "strict", config),
    ).toBeUndefined();

    expect(validateSearchField("profile:script:1 ", "strict", config)).toBe(
      '"profile" has invalid profile type "script".',
    );
  });

  it("should validate with mixed config settings", () => {
    const config = {
      profileTypes: ["security", "wsl"],
      usgStatuses: ["pass"],
      wslStatuses: ["compliant"],
    };

    expect(
      validateSearchField("profile:security:1:pass ", "strict", config),
    ).toBeUndefined();

    expect(
      validateSearchField("profile:security:1:fail ", "strict", config),
    ).toBe('"profile:security" has invalid security status "fail".');

    expect(
      validateSearchField("profile:wsl:1:compliant ", "strict", config),
    ).toBeUndefined();

    expect(
      validateSearchField("profile:wsl:1:noncompliant ", "strict", config),
    ).toBe('"profile:wsl" has invalid WSL status "noncompliant".');

    expect(validateSearchField("profile:package:1 ", "strict", config)).toBe(
      '"profile" has invalid profile type "package".',
    );
  });
});
