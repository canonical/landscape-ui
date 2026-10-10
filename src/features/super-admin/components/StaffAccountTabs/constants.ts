export const TABS = [
  { label: "Info", id: "tab-link-info", role: "tab", hasTable: false },
  {
    label: "Administrators",
    id: "tab-link-administrators",
    role: "tab",
    hasTable: true,
  },
  { label: "Licenses", id: "tab-link-licenses", role: "tab", hasTable: true },
  { label: "Features", id: "tab-link-features", role: "tab", hasTable: true },
  { label: "WSL", id: "tab-link-wsl", role: "tab", hasTable: false },
] as const;

/** Whether the tab the `tab` page param names renders a table. */
export const isTableTab = (tab: string): boolean =>
  TABS.some(({ id, hasTable }) => hasTable && id === `tab-link-${tab}`);
