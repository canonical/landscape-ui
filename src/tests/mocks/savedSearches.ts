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
  {
    name: "arm-servers",
    title: "ARM Architecture Servers",
    search: "arch:aarch64",
  },
  {
    name: "staging-env",
    title: "Staging Environment",
    search: "tag:staging",
  },
  {
    name: "cloud-instances",
    title: "Cloud Instances",
    search: "tag:cloud",
  },
  {
    name: "physical-hosts",
    title: "Physical Hosts",
    search: "virtualization:physical",
  },
  {
    name: "lts-only",
    title: "LTS Releases Only",
    search: "series:lts",
  },
  {
    name: "no-updates",
    title: "Up To Date Machines",
    search: "alert:package-upgrades:false",
  },
  {
    name: "proxied",
    title: "Proxied Machines",
    search: "tag:proxy",
  },
  {
    name: "containers",
    title: "Container Hosts",
    search: "tag:container",
  },
  {
    name: "europe-region",
    title: "Europe Region",
    search: "tag:eu",
  },
  {
    name: "us-region",
    title: "US Region",
    search: "tag:us",
  },
  {
    name: "apac-region",
    title: "APAC Region",
    search: "tag:apac",
  },
  {
    name: "gpu-nodes",
    title: "GPU Nodes",
    search: "tag:gpu",
  },
  {
    name: "edge-devices",
    title: "Edge Devices",
    search: "tag:edge",
  },
  {
    name: "test-machines",
    title: "Test Machines",
    search: "tag:test",
  },
  {
    name: "monitoring",
    title: "Monitoring Agents",
    search: "tag:monitoring",
  },
] as const satisfies SavedSearch[];

export const [savedSearch] = savedSearches;
