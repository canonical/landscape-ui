import type { Mirror } from "@canonical/landscape-openapi";

export const mirrors = [
  {
    name: "mirrors/ubuntu-archive-mirror",
    mirrorId: "ubuntu-archive-mirror",
    displayName: "Ubuntu archive mirror",
    archiveRoot: "https://archive.ubuntu.com/ubuntu",
    distribution: "jammy",
    components: ["main", "restricted", "universe", "multiverse"],
    architectures: ["amd64", "arm64"],
    downloadInstaller: true,
    downloadSources: false,
    downloadUdebs: true,
    lastDownloadDate: new Date("2024-06-01T12:00:00Z"),
  },
  {
    name: "mirrors/ubuntu-security-mirror",
    mirrorId: "ubuntu-security-mirror",
    displayName: "Security mirror",
    archiveRoot: "https://security.ubuntu.com/ubuntu",
    distribution: "noble",
    components: ["main", "universe"],
    architectures: ["amd64"],
    downloadInstaller: false,
    downloadSources: true,
    downloadUdebs: false,
    lastDownloadDate: new Date("2024-05-01T12:00:00Z"),
  },
] as const satisfies Mirror[];
