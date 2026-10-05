/** A session navigation entry: a page, a group of pages, or a placeholder (neither). */
export interface SupportSessionNavItem {
  label: string;
  icon: string;
  path?: string;
  items?: { label: string; path: string }[];
}
