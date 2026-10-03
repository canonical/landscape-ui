export const TABS = [
  { label: "Info", id: "tab-link-info", role: "tab", hasTable: false },
  {
    label: "Administrators",
    id: "tab-link-administrators",
    role: "tab",
    hasTable: true,
  },
  { label: "Licenses", id: "tab-link-licenses", role: "tab", hasTable: true },
  {
    label: "Feature flags",
    id: "tab-link-feature-flags",
    role: "tab",
    hasTable: true,
  },
] as const;

/** Whether the tab the `tab` page param names renders a table. */
export const isTableTab = (tab: string): boolean =>
  TABS.some(({ id, hasTable }) => hasTable && id === `tab-link-${tab}`);
