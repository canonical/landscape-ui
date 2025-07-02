export interface RemovalProfile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  cascade_to_children: boolean;
  days_without_exchange: number;
  id: number;
  name: string;
  tags: string[];
  title: string;
}
