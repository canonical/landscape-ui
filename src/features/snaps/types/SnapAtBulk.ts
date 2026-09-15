export type SnapAction = "install" | "remove" | "refresh" | "hold" | "unhold" | "changeChannel";

export interface InstalledSnap {
  id: string;
  name: string;
  channel: string;
  revision: string;
  tracking_channel: string;
  held_until: string | null;
  confinement: string;
  publisher: string;
  computers: string[];
}
