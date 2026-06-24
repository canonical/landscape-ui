import { describe, expect, it } from "vitest";
import { getInitialValues } from "./helpers";

describe("getInitialValues", () => {
  it("selects every export field when no columns are disabled", () => {
    expect(getInitialValues([]).selectedFieldIds).toEqual([
      "title",
      "status",
      "upgrades_security",
      "upgrades_regular",
      "os",
      "tags",
      "availability_zone",
      "ubuntu_pro",
      "last_ping_time",
    ]);
  });

  it("omits fields mapped to disabled columns", () => {
    expect(getInitialValues(["status", "tags"]).selectedFieldIds).toEqual([
      "title",
      "upgrades_security",
      "upgrades_regular",
      "os",
      "availability_zone",
      "ubuntu_pro",
      "last_ping_time",
    ]);
  });

  it("omits both export fields for a column mapped to multiple fields", () => {
    expect(getInitialValues(["upgrades"]).selectedFieldIds).toEqual([
      "title",
      "status",
      "os",
      "tags",
      "availability_zone",
      "ubuntu_pro",
      "last_ping_time",
    ]);
  });
});
