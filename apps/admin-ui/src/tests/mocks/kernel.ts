import type { Fix } from "@/features/kernel";

export const patches: Fix[] = [
  {
    Name: "cve-2013-1797",
    Patched: false,
    Bug: "bug-1",
    Description: "Test description 1",
  },
  {
    Name: "cve-2013-1798",
    Patched: false,
    Bug: "bug-2",
    Description: "Test description 2",
  },
  {
    Name: "cve-2013-1799",
    Patched: false,
    Bug: "bug-3",
    Description: "Test description 3",
  },
  {
    Name: "cve-2013-1800",
    Patched: true,
    Bug: "bug-4",
    Description: "Test description 4",
  },
  {
    Name: "cve-2013-1801",
    Patched: true,
    Bug: "bug-5",
    Description: "Test description 5",
  },
  {
    Name: "cve-2013-1802",
    Patched: true,
    Bug: "bug-6",
    Description: "Test description 6",
  },
  {
    Name: "cve-2013-1803",
    Patched: false,
    Bug: "bug-7",
    Description: "Test description 7",
  },
];
