export type ProfileType =
  | "package"
  | "reboot"
  | "removal"
  | "repository"
  | "usg"
  | "script"
  | "upgrade"
  | "wsl";

export interface Profile extends Record<string, unknown> {
  id: number;
  name: string | null;
  title: string;
  type: ProfileType;
}
