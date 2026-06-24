import type { Local } from "@canonical/landscape-openapi";

export const repositories = [
  {
    name: "locals/aaaa-bbbb-cccc",
    localId: "aaaa-bbbb-cccc",
    displayName: "Local with no description",
    defaultComponent: "main",
    defaultDistribution: "noble",
    lastOperation: "operations/ssss-cccc-dddd",
    lastImportTime: new Date("2024-06-01T12:00:00Z"),
  },
  {
    name: "locals/bbbb-cccc-dddd",
    localId: "bbbb-cccc-dddd",
    displayName: "In progress import local",
    comment: "local with a package import in progress",
    defaultComponent: "universe",
    defaultDistribution: "noble",
    lastOperation: "operations/pppp-gggg-ssss",
    lastImportTime: new Date("2024-06-02T12:00:00Z"),
  },
  {
    name: "locals/cccc-dddd-eeee",
    localId: "cccc-dddd-eeee",
    displayName: "Failed import local",
    comment: "local with failed package import",
    defaultDistribution: "focal",
    defaultComponent: "main",
    lastOperation: "operations/ffff-llll-dddd",
    lastImportTime: new Date("2024-06-03T12:00:00Z"),
  },
  {
    name: "locals/dddd-eeee-ffff",
    localId: "dddd-eeee-ffff",
    displayName: "Invalid LRO local",
    comment: "local with an invalid last operation reference",
    defaultDistribution: "jammy",
    defaultComponent: "main",
    lastOperation: "operations/non-existent-operation",
    lastImportTime: new Date("2024-06-04T12:00:00Z"),
  },
  {
    name: "locals/eeee-ffff-gggg",
    localId: "eeee-ffff-gggg",
    displayName: "No imports local",
    comment: "local with no package import attempts",
    defaultDistribution: "noble",
    defaultComponent: "multiverse",
  },
] as const satisfies Local[];

export const paginatedPackages = Array.from(
  { length: 25 },
  (_, i) => `package-${i + 1}`,
);

export const sortedPackages = paginatedPackages.toSorted((a, b) =>
  a.localeCompare(b),
);
