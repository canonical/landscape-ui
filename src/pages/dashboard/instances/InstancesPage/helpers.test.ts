import { describe, expect, it } from "vitest";
import { FILTERS } from "@/features/instances";
import { getOptionQuery, getQuery } from "./helpers";

const windowsOption = FILTERS.os.options.find(
  (option) => option.value === "windows",
);
const offlineStatusOption = FILTERS.status.options.find(
  (option) => option.value === "computer-offline",
);
const contractOption = FILTERS.contractExpiryDays.options.find(
  (option) => option.value === "30",
);

assert(windowsOption);
assert(offlineStatusOption);
assert(contractOption);

describe("InstancesPage helpers", () => {
  it("returns option query for select filters", () => {
    expect(getOptionQuery(FILTERS.os, windowsOption.value)).toBe(
      windowsOption.query,
    );
  });

  it("returns empty string when select option does not exist", () => {
    expect(getOptionQuery(FILTERS.os, "missing-option")).toBe("");
  });

  it("returns empty query for non-select filters", () => {
    expect(getOptionQuery(FILTERS.wsl, "parent")).toBe("");
  });

  it("builds combined search query from all active filters", () => {
    const query = getQuery({
      os: windowsOption.value,
      status: offlineStatusOption.value,
      contractExpiryDays: contractOption.value,
      query: "name:web,annotation:prod",
      tags: ["db", "prod"],
      upgrades: ["security-upgrades", "package-upgrades"],
      accessGroups: ["global", "ops"],
      availabilityZones: ["eu-west-1a", "eu-west-1b"],
    });

    expect(query).toBe(
      [
        windowsOption.query,
        getOptionQuery(FILTERS.status, offlineStatusOption.value),
        getOptionQuery(FILTERS.contractExpiryDays, contractOption.value),
        "name:web",
        "annotation:prod",
        "tag:db OR tag:prod",
        "alert:security-upgrades OR alert:package-upgrades",
        "access-group:global OR access-group:ops",
        "availability-zone:eu-west-1a OR availability-zone:eu-west-1b",
      ].join(" "),
    );
  });

  it("builds an OR query for selected upgrade types", () => {
    const query = getQuery({
      os: "",
      status: "",
      contractExpiryDays: "",
      query: "",
      tags: [],
      upgrades: ["security-upgrades"],
      accessGroups: [],
      availabilityZones: [],
    });

    expect(query).toBe("alert:security-upgrades");
  });

  it("uses null availability zone query when none is selected", () => {
    const query = getQuery({
      os: "",
      status: "",
      contractExpiryDays: "",
      query: "",
      tags: [],
      upgrades: [],
      accessGroups: [],
      availabilityZones: ["none"],
    });

    expect(query).toBe("availability-zone:null");
  });

  it("omits availability zone when none are selected", () => {
    const query = getQuery({
      os: windowsOption.value,
      status: "",
      contractExpiryDays: "",
      query: "",
      tags: [],
      upgrades: [],
      accessGroups: [],
      availabilityZones: [],
    });

    expect(query).toBe(windowsOption.query);
  });
});
