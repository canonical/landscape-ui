import type { APTSource } from "@/features/apt-sources";

export const aptSources: APTSource[] = [
  {
    id: 1,
    access_group: "group1",
    gpg_key: "key1",
    line: "deb http://example.com/ubuntu focal main",
    name: "source1",
  },
  {
    id: 2,
    access_group: "group2",
    gpg_key: "key2",
    line: "deb http://example.com/ubuntu focal main",
    name: "source2",
  },
  {
    id: 3,
    access_group: "group3",
    gpg_key: "key3",
    line: "deb http://example.com/ubuntu focal main",
    name: "source3",
  },
  {
    id: 4,
    access_group: "group4",
    gpg_key: "key4",
    line: "deb http://example.com/ubuntu focal main",
    name: "source4",
  },
  {
    id: 5,
    access_group: "group5",
    gpg_key: "key5",
    line: "deb http://example.com/ubuntu focal main",
    name: "source5",
  },
];
