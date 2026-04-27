export type ProfileActions =
  | "edit"
  | "edit-constraints"
  | "run"
  | "download"
  | "duplicate"
  | "view";

export interface ComplianceInstanceCounts {
  constrained: number[];
  "non-compliant": number[];
  pending: number[];
}

export interface Profile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  description?: string;
  id: number;
  name: string;
  tags: string[];
  title: string;
}
