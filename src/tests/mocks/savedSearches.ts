import type { SavedSearch } from "@/features/saved-searches";

export const savedSearches = [
  {
    name: "package-upgrades",
    title: "Computers with upgrades",
    search: "alert:package-upgrades",
  },
  {
    name: "security-upgrades",
    title: "Computers with security upgrades",
    search: "alert:security-upgrades",
  },
  {
    name: "local-subnet",
    title: "Local subnet",
    search: "ip:192.168.11",
  },
  {
    name: "offline-servers",
    title: "Offline Production Servers",
    search:
      "alert:computer-offline AND tag:production AND tag:server AND NOT tag:maintenance",
  },
  {
    name: "ubuntu-22-04",
    title: "Ubuntu 22.04 Machines",
    search: "distribution:jammy",
  },
  {
    name: "high-memory",
    title: "High Memory Usage",
    search: "memory-usage:>80",
  },
  {
    name: "web-servers",
    title: "Web Servers",
    search: "tag:webserver",
  },
  {
    name: "critical-alerts",
    title: "Computers with Critical Alerts",
    search: "alert:security-upgrades OR alert:computer-offline",
  },
  {
    name: "database-cluster",
    title: "Database Cluster Nodes",
    search: "tag:database AND tag:cluster",
  },
  {
    name: "reboot-required",
    title: "Machines Needing Reboot",
    search: "reboot-required:true",
  },
] as const satisfies SavedSearch[];

export const [savedSearch] = savedSearches;
