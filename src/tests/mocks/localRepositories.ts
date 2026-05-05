import type { Local } from "@canonical/landscape-openapi";

export const repositories = [
  {
    name: "locals/aaaa-bbbb-cccc",
    localId: "aaaa-bbbb-cccc",
    defaultComponent: "component 1",
    displayName: "repo 1",
    defaultDistribution: "distribution 1",
  },
  {
    name: "locals/bbbb-cccc-dddd",
    localId: "bbbb-cccc-dddd",
    displayName: "repo 2",
    comment: "repo 2 description",
    defaultComponent: "component 2",
    defaultDistribution: "distribution 2",
  },
  {
    name: "locals/cccc-dddd-eeee",
    localId: "cccc-dddd-eeee",
    displayName: "repo 3",
    comment: "repo 3 description",
    defaultDistribution: "distribution 3",
    defaultComponent: "component 3",
  },
] as const satisfies Local[];

export const paginatedPackages = Array.from(
  { length: 25 },
  (_, i) => `package-${i + 1}`,
);
