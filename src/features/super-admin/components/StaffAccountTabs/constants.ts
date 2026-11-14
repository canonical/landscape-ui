export const TABS = [
  { label: "Info", id: "info", hasTable: false },
  { label: "Administrators", id: "administrators", hasTable: true },
  { label: "Licenses", id: "licenses", hasTable: true },
  { label: "Features", id: "features", hasTable: true },
  { label: "WSL", id: "wsl", hasTable: false },
] as const;

export type StaffAccountTabId = (typeof TABS)[number]["id"];

/** Whether the tab the `tab` page param names renders a table. */
export const isTableTab = (tab: string): boolean =>
  TABS.some(({ id, hasTable }) => hasTable && id === tab);
