import type { Publication } from "@/features/publications";

export const publications = [
  {
    id: 1,
    name: "Text",
    source_type: "Mirror",
    source: "mirror_name",
    publication_target: "target_name",
    date_published: "2024-06-01T12:00:00Z",
    prefix: "Root directory",
    settings: {
      hash_indexing: false,
      automatic_installation: false,
      automatic_upgrades: false,
      skip_bz2: false,
      skip_content_indexing: false,
    },
    uploaders: {
      distribution: "bionic-backports",
      components: ["main", "universe"],
      architectures: ["amd64", "i368"],
    },
  },
] as const satisfies Publication[];
