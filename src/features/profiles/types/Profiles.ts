export type ProfileActions = 
  | "add"
  | "edit"
  | "edit-constraints"
  | "run"
  | "download"
  | "duplicate";

export type ProfileType =
  | "package"
  | "reboot"
  | "removal"
  | "repository"
  | "script"
  | "security"
  | "upgrade"
  | "wsl";

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
