import type { APTSource } from "@/features/repository-profiles";
import type { GPGKey } from "@/features/repository-profiles";

const mockGpgKeys: Record<
  "key1" | "key2" | "key3" | "key4" | "key5" | "key6",
  GPGKey
> = {
  key1: {
    id: 1,
    name: "key1",
    key_id: "KEY1ID00",
    fingerprint: "AAAA1111",
    has_secret: false,
  },
  key2: {
    id: 2,
    name: "key2",
    key_id: "KEY2ID00",
    fingerprint: "BBBB2222",
    has_secret: false,
  },
  key3: {
    id: 3,
    name: "key3",
    key_id: "KEY3ID00",
    fingerprint: "CCCC3333",
    has_secret: false,
  },
  key4: {
    id: 4,
    name: "key4",
    key_id: "KEY4ID00",
    fingerprint: "DDDD4444",
    has_secret: false,
  },
  key5: {
    id: 5,
    name: "key5",
    key_id: "KEY5ID00",
    fingerprint: "EEEE5555",
    has_secret: false,
  },
  key6: {
    id: 6,
    name: "key6",
    key_id: "KEY6ID00",
    fingerprint: "FFFF6666",
    has_secret: false,
  },
};

export const aptSources = [
  {
    id: 1,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source1",
    profiles: [
      "repo-profile-1",
      "repo-profile-3",
      "repo-profile-4",
      "repo-profile-5",
      "repo-profile-6",
      "repo-profile-7",
      "repo-profile-8",
      "repo-profile-9",
      "repo-profile-10",
      "repo-profile-11",
      "repo-profile-12",
    ] as string[],
  },
  {
    id: 2,
    access_group: "group2",
    gpg_key: mockGpgKeys.key2,
    line: "deb http://example.com/ubuntu focal main",
    name: "source2",
    profiles: ["repo-profile-1"] as string[],
  },
  {
    id: 3,
    access_group: "group3",
    gpg_key: mockGpgKeys.key3,
    line: "deb http://example.com/ubuntu focal main",
    name: "source3",
    profiles: [] as string[],
  },
  {
    id: 4,
    access_group: "group4",
    gpg_key: mockGpgKeys.key4,
    line: "deb http://example.com/ubuntu focal main",
    name: "source4",
    profiles: [] as string[],
  },
  {
    id: 5,
    access_group: "group5",
    gpg_key: mockGpgKeys.key5,
    line: "deb http://example.com/ubuntu focal main",
    name: "source5",
    profiles: [] as string[],
  },
  {
    id: 6,
    access_group: "group1",
    gpg_key: mockGpgKeys.key6,
    line: "deb http://example.com/ubuntu focal main",
    name: "source6",
    profiles: ["repo-profile-1"] as string[],
  },

  {
    id: 7,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source7",
    profiles: ["repo-profile-1"] as string[],
  },

  {
    id: 8,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source8",
    profiles: ["repo-profile-1"] as string[],
  },

  {
    id: 9,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source9",
    profiles: ["repo-profile-1"] as string[],
  },

  {
    id: 10,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source10",
    profiles: ["repo-profile-1"] as string[],
  },

  {
    id: 11,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source11",
    profiles: ["repo-profile-1"] as string[],
  },

  {
    id: 12,
    access_group: "group1",
    gpg_key: mockGpgKeys.key1,
    line: "deb http://example.com/ubuntu focal main",
    name: "source12",
    profiles: ["repo-profile-1"] as string[],
  },
] as const satisfies APTSource[];
