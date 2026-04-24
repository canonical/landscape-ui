import type {
  Local,
  Publication,
  PublicationTarget,
} from "@/features/publications";

export const publications = [
  {
    name: "publications/7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
    publicationId: "7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
    publicationTarget: "publicationTargets/primary-us-mirror",
    source: "mirrors/ubuntu-archive-mirror",
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
  },
  {
    name: "publications/c9f6355e-c8f3-4e73-ab4c-ef6a4c8af4c0",
    publicationId: "c9f6355e-c8f3-4e73-ab4c-ef6a4c8af4c0",
    publicationTarget: "publicationTargets/emea-mirror",
    source: "mirrors/ubuntu-security-mirror",
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
  },
] as const satisfies Publication[];

export const locals = [
  {
    name: "locals/internal-packages",
    localId: "internal-packages",
    displayName: "Internal packages",
    defaultDistribution: "focal",
    defaultComponent: "main",
  },
] as const satisfies Local[];

export const publicationTargets = [
  {
    name: "publicationTargets/primary-us-mirror",
    publicationTargetId: "primary-us-mirror",
    displayName: "Primary US mirror",
  },
  {
    name: "publicationTargets/emea-mirror",
    publicationTargetId: "emea-mirror",
    displayName: "EMEA mirror",
  },
  {
    name: "publicationTargets/internal-datacenter",
    publicationTargetId: "internal-datacenter",
    displayName: "Internal datacenter",
  },
] as const satisfies PublicationTarget[];
