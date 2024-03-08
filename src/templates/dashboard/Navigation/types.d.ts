export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  items?: MenuItem[];
}
