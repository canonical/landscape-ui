import type { RepositoryProfile } from "@/features/repository-profiles";

export const repositoryProfiles: RepositoryProfile[] = [
  {
    id: 1,
    name: "repo-profile-1",
    title: "Repository profile 1",
    description: "Test profile one",
    access_group: "global",
    all_computers: false,
    apt_sources: [1, 2],
    pockets: [],
    tags: ["web", "prod"],
    pending_count: 0,
  },
  {
    id: 2,
    name: "repo-profile-2",
    title: "Repository profile 2",
    description: "",
    access_group: "global",
    all_computers: true,
    apt_sources: [],
    pockets: [],
    tags: [],
    pending_count: 0,
  },
];
