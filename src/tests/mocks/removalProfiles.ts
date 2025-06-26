import type { RemovalProfile } from "@/features/removal-profiles";

export const removalProfiles: RemovalProfile[] = [
  {
    id: 1,
    name: "profile-1",
    title: "Removal profile 1",
    access_group: "global",
    all_computers: false,
    cascade_to_children: false,
    days_without_exchange: 30,
    tags: ["alpha", "beta"],
  },
  {
    id: 2,
    name: "profile-2",
    title: "Removal profile 2",
    access_group: "global",
    all_computers: true,
    cascade_to_children: false,
    days_without_exchange: 14,
    tags: [],
  },
];
