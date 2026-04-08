interface ChannelMap {
  channel: Channel;
  confinement: string;
  revision: number;
  version: string;
}

interface Channel {
  architecture: string;
  name: string;
  "released-at": string;
  risk: string;
  track: string;
}

interface Snap {
  id: string;
  publisher: Publisher;
  name: string;
  summary?: string;
}

interface Publisher {
  username: string;
  validation: string;
  id?: string;
  "display-name"?: string;
}

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
