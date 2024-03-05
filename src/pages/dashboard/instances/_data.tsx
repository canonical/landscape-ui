import { ReactElement } from "react";

export const INSTANCE_SEARCH_HELP_TERMS: {
  term: string;
  description: string | ReactElement;
}[] = [
  {
    term: "<keyword>",
    description: (
      <span>
        Instances with the title or hostname <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "distribution:<keyword>",
    description: (
      <span>
        Instances with the installed distribution named{" "}
        <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "needs:reboot",
    description: "Instances needing a reboot",
  },
  {
    term: "alert:<type>",
    description: (
      <>
        <span>
          Instances with outstanding alerts of the specified{" "}
          <code>&lt;type&gt;</code>
        </span>
        <br />
        <span>
          <code>&lt;type&gt;</code> can be <code>package-upgrades</code>,{" "}
          <code>security-upgrades</code>,<code>package-profiles</code>,{" "}
          <code>package-reporter</code>, <code>esm-disabled</code>,{" "}
          <code>computer-offline</code>,<code>computer-reboot</code>,{" "}
          <code>computer-duplicates</code>, <code>unapproved-activities</code>.
        </span>
      </>
    ),
  },
  {
    term: "ip:<address>",
    description: (
      <>
        <span>
          Instances with IP addresses like <code>&lt;address&gt;</code>
        </span>
        <br />
        <span>
          <code>&lt;address&gt;</code> can be a fragment or partial IP address
          representing a subnet such as 91.185.94 to match any instances in the
          subnet.
        </span>
      </>
    ),
  },
  {
    term: "mac:<address>",
    description: (
      <span>
        Instances with the MAC address <code>&lt;address&gt;</code>
      </span>
    ),
  },
  {
    term: "id:<instance_id>",
    description: (
      <span>
        Instance with the id <code>&lt;instance_id&gt;</code>
      </span>
    ),
  },
  {
    term: "access-group:<name>",
    description: (
      <span>
        Instances associated with the <code>&lt;name&gt;</code> access group
      </span>
    ),
  },
  {
    term: "search:<name>",
    description: (
      <span>
        Instances meeting the terms of the <code>&lt;name&gt;</code> saved
        search
      </span>
    ),
  },
  {
    term: "upgrade-profile:<name>",
    description: (
      <span>
        Instances associated with the <code>&lt;name&gt;</code> upgrade profile
      </span>
    ),
  },
  {
    term: "removal-profile:<name>",
    description: (
      <span>
        Instances associated with the <code>&lt;name&gt;</code> removal profile
      </span>
    ),
  },
  {
    term: "tag:<keyword>",
    description: (
      <span>
        Instances associated with the <code>&lt;keyword&gt;</code> tag
      </span>
    ),
  },
  {
    term: "hostname:<keyword>",
    description: (
      <span>
        Instance with the hostname <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "title:<keyword>",
    description: (
      <span>
        Instance with the title <code>&lt;keyword&gt;</code>
      </span>
    ),
  },
  {
    term: "license-id:<license_id>",
    description: (
      <span>
        Search for instances licensed to the specified{" "}
        <code>&lt;license_id&gt;</code>
      </span>
    ),
  },
  {
    term: "needs:license OR license-id:none",
    description:
      "Search for instances that do not have a Landscape license, and, as a result, are not managed",
  },
  {
    term: "annotation:<key>",
    description: (
      <span>
        Search for instances which define the specified annotation key.
        Optionally specify <code>annotation:&lt;key&gt;:&lt;string&gt;</code>{" "}
        which will only return instances whose key matches and value also
        contains the <code>&lt;string&gt;</code> specified
      </span>
    ),
  },
];

export const mockUsns = [
  {
    cves_ids: ["CVE-9667-0317", "CVE-9667-0318", "CVE-9667-0319"],
    published: "2024-01-11T14:01:38.786Z",
    release_packages: [
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
    ],
    summary: "1-1 summary",
    name: "1-1",
  },
  {
    cves_ids: [
      "CVE-9667-0317",
      "CVE-9667-0318",
      "CVE-9667-0319",
      "CVE-9667-0320",
      "CVE-9667-0321",
    ],
    published: "2024-01-11T14:01:38.786Z",
    release_packages: [
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
    ],
    summary: "1-2 summary",
    name: "1-2",
  },
  {
    cves_ids: [
      "CVE-9667-0317",
      "CVE-9667-0318",
      "CVE-9667-0319",
      "CVE-9667-0320",
      "CVE-9667-0321",
      "CVE-9667-0322",
    ],
    published: "2024-01-11T14:01:38.786Z",
    release_packages: [
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
    ],
    summary: "1-3 summary",
    name: "1-3",
  },
  {
    cves_ids: [
      "CVE-9667-0317",
      "CVE-9667-0318",
      "CVE-9667-0319",
      "CVE-9667-0320",
      "CVE-9667-0321",
    ],
    published: "2024-01-11T14:01:38.786Z",
    release_packages: [
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
    ],
    summary: "1-4 summary",
    name: "1-4",
  },
  {
    cves_ids: [
      "CVE-9667-0317",
      "CVE-9667-0318",
      "CVE-9667-0319",
      "CVE-9667-0320",
      "CVE-9667-0321",
      "CVE-9667-0322",
    ],
    published: "2024-01-11T14:01:38.786Z",
    release_packages: [
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
    ],
    summary: "1-5 summary",
    name: "1-5",
  },
  {
    cves_ids: ["CVE-9667-0317"],
    published: "2024-01-11T14:01:38.786Z",
    release_packages: [
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libpci2",
        current_version: "2:2.1.11-3build1",
        fix_version: "2:2.1.11-3build1-2",
        summary: "Obsolete shared library for accessing pci devices",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "findutils",
        current_version: "4.2.31-1ubuntu2.1",
        fix_version: "4.2.31-1ubuntu2.1-2",
        summary: "utilities for finding files--find, xargs, and locate",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
      {
        name: "libthai0",
        current_version: "0.1.9-1",
        fix_version: "0.1.9-1-1",
        summary: "Thai language support library",
        computers: {
          installed: [],
          available: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          upgrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          held: [],
        },
      },
    ],
    summary: "1-6 summary",
    name: "1-6",
  },
];
