import type { Profile } from "@/features/profiles";

export const profiles = [
  {
    access_group: "global",
    all_computers: false,
    description: "first profile description",
    id: 1,
    name: "profile-1",
    tags: ["tag"],
    title: "Profile One",
  },
  {
    access_group: "global",
    all_computers: false,
    description: "desc",
    id: 2,
    name: "two",
    tags: [],
    title: "Profile Two",
  },
  {
    access_group: "global",
    all_computers: true,
    description: "",
    id: 3,
    name: "three",
    tags: [],
    title: "Profile Three",
  },
] as const satisfies Profile[];
