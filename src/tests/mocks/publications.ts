import type { Publication } from "@canonical/landscape-openapi";

export { publicationTargets } from "@/tests/mocks/publicationTargets";

export const publications = [
  {
    name: "publications/7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
    publicationId: "7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
    publicationTarget:
      "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    source: "mirrors/ubuntu-archive-mirror",
    displayName: "jammy publication",
    distribution: "jammy",
    label: "Primary publication",
    origin: "Canonical",
    architectures: ["amd64", "arm64"],
    acquireByHash: true,
    butAutomaticUpgrades: false,
    notAutomatic: false,
    multiDist: false,
    skipBz2: false,
    skipContents: false,
    publishTime: new Date("March 12, 2026"),
  },
  {
    name: "publications/c9f6355e-c8f3-4e73-ab4c-ef6a4c8af4c0",
    publicationId: "c9f6355e-c8f3-4e73-ab4c-ef6a4c8af4c0",
    displayName: "noble publication",
    publicationTarget:
      "publicationTargets/bbbbbbbb-0000-0000-0000-000000000002",
    source: "locals/aaaa-bbbb-cccc",
    distribution: "noble",
    label: "EMEA publication",
    origin: "Canonical",
    architectures: ["amd64"],
    acquireByHash: false,
    butAutomaticUpgrades: true,
    notAutomatic: true,
    multiDist: true,
    skipBz2: true,
    skipContents: true,
    gpgKey: {
      armor: "-----BEGIN PGP PRIVATE KEY BLOCK-----...",
    },
    publishTime: new Date("March 12, 2026"),
  },
  {
    name: "publications/g8h8888e-c8f8-8e88-ab8c-ef8a8c8af8c8",
    publicationId: "g8h8888e-c8f8-8e88-ab8c-ef8a8c8af8c8",
    displayName: "local publication",
    publicationTarget:
      "publicationTargets/cccccccc-0000-0000-0000-000000000003",
    source: "locals/bbbb-cccc-dddd",
    distribution: "noble",
    label: "Local publication",
    origin: "Canonical",
    architectures: ["amd64"],
    acquireByHash: false,
    butAutomaticUpgrades: false,
    notAutomatic: true,
    multiDist: false,
    skipBz2: true,
    skipContents: true,
    publishTime: new Date("April 20, 2026"),
  },
] as const satisfies Publication[];
