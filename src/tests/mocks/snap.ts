import { AvailableSnap, AvailableSnapInfo, InstalledSnap } from "@/types/Snap";

export const availableSnaps: AvailableSnap[] = [
  {
    name: "Snap 1",
    "snap-id": "1",
    snap: {
      id: "1",
      name: "snap1",
      publisher: {
        "display-name": "Publisher 1",
        id: "1",
        username: "publisher1",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 2",
    "snap-id": "2",
    snap: {
      id: "2",
      name: "snap2",
      publisher: {
        "display-name": "Publisher 2",
        id: "2",
        username: "publisher2",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 3",
    "snap-id": "3",
    snap: {
      id: "3",
      name: "snap3",
      publisher: {
        "display-name": "Publisher 3",
        id: "3",
        username: "publisher3",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 4",
    "snap-id": "4",
    snap: {
      id: "4",
      name: "snap4",
      publisher: {
        "display-name": "Publisher 4",
        id: "4",
        username: "publisher4",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 5",
    "snap-id": "5",
    snap: {
      id: "5",
      name: "snap5",
      publisher: {
        "display-name": "Publisher 5",
        id: "5",
        username: "publisher5",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 6",
    "snap-id": "6",
    snap: {
      id: "6",
      name: "snap6",
      publisher: {
        "display-name": "Publisher 6",
        id: "6",
        username: "publisher6",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 7",
    "snap-id": "7",
    snap: {
      id: "7",
      name: "snap7",
      publisher: {
        "display-name": "Publisher 7",
        id: "7",
        username: "publisher7",
        validation: "verified",
      },
    },
  },
  {
    name: "Snap 11",
    "snap-id": "11",
    snap: {
      id: "11",
      name: "snap11",
      publisher: {
        "display-name": "Publisher 11",
        id: "11",
        username: "publisher11",
        validation: "verified",
      },
    },
  },
];

export const installedSnaps: InstalledSnap[] = [
  {
    version: "20230801",
    revision: "2015",
    tracking_channel: "latest/stable",
    held_until: null,
    confinement: "strict",
    snap: {
      id: "1",
      name: "Snap 1",
      publisher: { username: "canonical", validation: "verified" },
      summary: "Runtime environment based on Ubuntu 20.04",
    },
  },
  {
    version: "5.0.2-838e1b2",
    revision: "24322",
    tracking_channel: "5.0/stable/ubuntu-22.04",
    held_until: null,
    confinement: "strict",
    snap: {
      id: "2",
      name: "Snap 2",
      publisher: { username: "canonical", validation: "verified" },
      summary: "LXD - container and VM manager",
    },
  },
  {
    version: "2.60.4",
    revision: "20290",
    tracking_channel: "latest/stable",
    held_until: "3000-01-01T00:00:00Z",
    confinement: "strict",
    snap: {
      id: "3",
      name: "Snap 3",
      publisher: { username: "canonical", validation: "verified" },
      summary: "Daemon and tooling that enable snap packages",
    },
  },
  {
    version: "2.61.6",
    revision: "20293",
    tracking_channel: "latest/stable",
    held_until: "2030-01-01T00:00:00Z",
    confinement: "strict",
    snap: {
      id: "4",
      name: "Snap 4",
      publisher: { username: "canonical", validation: "verified" },
      summary: "Extra tooling for helpful actions",
    },
  },
];

export const availableSnapInfo: AvailableSnapInfo[] = [
  {
    name: "Snap 2",
    "snap-id": "1",
    "channel-map": [
      {
        channel: {
          architecture: "amd64",
          name: "latest",
          "released-at": "2021-08-01T00:00:00Z",
          risk: "stable",
          track: "latest",
        },
        confinement: "strict",
        revision: 1,
        version: "1.0.0",
      },
      {
        channel: {
          architecture: "amd86",
          name: "latest",
          "released-at": "2022-07-01T00:00:00Z",
          risk: "stable",
          track: "latest",
        },
        confinement: "classic",
        revision: 2,
        version: "2.0.0",
      },
    ],
    "default-track": "latest",
    snap: {
      id: "1",
      name: "canonical",
      publisher: {
        username: "canonical",
        validation: "verified",
        "display-name": "Canonical",
        id: "1",
      },
    },
  },
  {
    name: "Snap 3",
    "snap-id": "2",
    "channel-map": [
      {
        channel: {
          architecture: "amd64",
          name: "latest",
          "released-at": "2021-08-01T00:00:00Z",
          risk: "stable",
          track: "latest",
        },
        confinement: "strict",
        revision: 1,
        version: "1.0.0",
      },
      {
        channel: {
          architecture: "amd86",
          name: "latest",
          "released-at": "2022-07-01T00:00:00Z",
          risk: "stable",
          track: "latest",
        },
        confinement: "classic",
        revision: 2,
        version: "2.0.0",
      },
    ],
    "default-track": "latest",
    snap: {
      id: "2",
      name: "canonical",
      publisher: {
        username: "canonical",
        validation: "verified",
        "display-name": "Canonical",
        id: "1",
      },
    },
  },
  {
    name: "Snap 4",
    "snap-id": "3",
    "channel-map": [
      {
        channel: {
          architecture: "amd64",
          name: "latest",
          "released-at": "2021-08-01T00:00:00Z",
          risk: "stable",
          track: "latest",
        },
        confinement: "strict",
        revision: 1,
        version: "1.0.0",
      },
      {
        channel: {
          architecture: "amd86",
          name: "latest",
          "released-at": "2022-07-01T00:00:00Z",
          risk: "stable",
          track: "latest",
        },
        confinement: "classic",
        revision: 2,
        version: "2.0.0",
      },
    ],
    "default-track": "latest",
    snap: {
      id: "3",
      name: "canonical",
      publisher: {
        username: "canonical",
        validation: "verified",
        "display-name": "Canonical",
        id: "1",
      },
    },
  },
];

export const successfulSnapInstallResponse = {
  id: 1000,
  creation_time: "2024-04-15T15:22:03Z",
  creator: { name: "John Smith", email: "john@example.com", id: 1 },
  type: "ActivityGroup",
  summary: "Install snaps on computer",
  completion_time: null,
  parent_id: null,
  deliver_delay_window: 0,
  result_text: null,
  result_code: null,
  activity_status: "undelivered",
};
