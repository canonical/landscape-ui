const DISTRIBUTORS = {
  ubuntu: "Ubuntu",
  ubuntuCore: "Ubuntu Core",
  windows: "Microsoft",
};

export const TAB_LINKS: {
  label: string;
  id: string;
  condition: (distributor: string) => boolean;
}[] = [
  {
    label: "Info",
    id: "tab-link-info",
    condition: () => true,
  },
  {
    label: "WSL",
    id: "tab-link-wsl",
    condition: (distributor) => distributor === DISTRIBUTORS.windows,
  },
  {
    label: "Activities",
    id: "tab-link-activities",
    condition: () => true,
  },
  {
    label: "Kernel",
    id: "tab-link-kernel",
    condition: (distributor) => distributor === DISTRIBUTORS.ubuntu,
  },
  {
    label: "Security issues",
    id: "tab-link-security-issues",
    condition: (distributor) => distributor === DISTRIBUTORS.ubuntu,
  },
  {
    label: "Packages",
    id: "tab-link-packages",
    condition: (distributor) => distributor === DISTRIBUTORS.ubuntu,
  },
  {
    label: "Snaps",
    id: "tab-link-snaps",
    condition: (distributor) => distributor !== DISTRIBUTORS.windows,
  },
  {
    label: "Processes",
    id: "tab-link-processes",
    condition: (distributor) => distributor !== DISTRIBUTORS.windows,
  },
  {
    label: "Ubuntu Pro",
    id: "tab-link-ubuntu-pro",
    condition: (distributor) =>
      [
        DISTRIBUTORS.ubuntu,
        DISTRIBUTORS.ubuntuCore,
        DISTRIBUTORS.windows,
      ].includes(distributor),
  },
  {
    label: "Users",
    id: "tab-link-users",
    condition: (distributor) =>
      ![DISTRIBUTORS.ubuntuCore, DISTRIBUTORS.windows].includes(distributor),
  },
  {
    label: "Hardware",
    id: "tab-link-hardware",
    condition: (distributor) => distributor !== DISTRIBUTORS.windows,
  },
];
