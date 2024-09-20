export interface InstalledSnap extends Record<string, unknown> {
  version: string;
  revision: string;
  tracking_channel: string;
  held_until: string | null;
  confinement: string;
  snap: Snap;
}

export interface AvailableSnap {
  "snap-id": string;
  name: string;
  snap: Snap;
}

export interface AvailableSnapInfo extends AvailableSnap {
  "channel-map": ChannelMap[];
  "default-track": unknown;
}

export interface SelectedSnaps extends AvailableSnap {
  channel: string;
  revision: string;
}

export interface ChannelMap {
  channel: Channel;
  confinement: string;
  revision: number;
  version: string;
}

export interface Channel {
  architecture: string;
  name: string;
  "released-at": string;
  risk: string;
  track: string;
}

export interface Snap {
  id: string;
  publisher: Publisher;
  name: string;
  summary?: string;
}

export interface Publisher {
  username: string;
  validation: string;
  id?: string;
  "display-name"?: string;
}
