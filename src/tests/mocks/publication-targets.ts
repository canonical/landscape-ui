import type {
  Publication,
  PublicationTarget,
  PublicationTargetWithPublications,
} from "@/features/publication-targets";

export const publications: Publication[] = [
  {
    name: "publications/11111111-0000-0000-0000-000000000001",
    publication_id: "11111111-0000-0000-0000-000000000001",
    display_name: "Ubuntu 22.04 LTS (Jammy)",
    publication_target: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    mirror: "mirrors/mirror-jammy-001",
    distribution: "jammy",
  },
  {
    name: "publications/22222222-0000-0000-0000-000000000002",
    publication_id: "22222222-0000-0000-0000-000000000002",
    display_name: "Ubuntu 24.04 LTS (Noble)",
    publication_target: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    mirror: "mirrors/mirror-noble-001",
    distribution: "noble",
  },
  {
    name: "publications/33333333-0000-0000-0000-000000000003",
    publication_id: "33333333-0000-0000-0000-000000000003",
    display_name: "Ubuntu 20.04 LTS (Focal)",
    publication_target: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    mirror: "mirrors/mirror-focal-001",
    distribution: "focal",
  },
];

export const publicationTargets: PublicationTarget[] = [
  {
    name: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    publication_target_id: "aaaaaaaa-0000-0000-0000-000000000001",
    display_name: "prod-s3-us-east",
    s3: {
      region: "us-east-1",
      bucket: "landscape-prod-packages",
      aws_access_key_id: "AKIAIOSFODNN7EXAMPLE",
      aws_secret_access_key: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      prefix: "ubuntu/",
      acl: "private",
      storage_class: "STANDARD",
      encryption_method: "AES256",
      disable_multi_del: false,
      force_sig_v2: false,
    },
  },
  {
    name: "publicationTargets/bbbbbbbb-0000-0000-0000-000000000002",
    publication_target_id: "bbbbbbbb-0000-0000-0000-000000000002",
    display_name: "staging-s3-eu-west",
    s3: {
      region: "eu-west-1",
      bucket: "landscape-staging-packages",
      aws_access_key_id: "AKIAIOSFODNN7EXAMPLE2",
      aws_secret_access_key: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2",
      disable_multi_del: true,
      force_sig_v2: false,
    },
  },
  {
    name: "publicationTargets/cccccccc-0000-0000-0000-000000000003",
    publication_target_id: "cccccccc-0000-0000-0000-000000000003",
    display_name: "swift-internal",
    swift: {
      container: "landscape-packages",
      username: "admin",
      password: "supersecret",
      auth_url: "https://keystone.example.com/v3",
      tenant: "landscape",
    },
  },
];

export const publicationTargetsWithPublications: PublicationTargetWithPublications[] =
  [
    {
      ...(publicationTargets[0] as PublicationTarget),
      publications: publications,
    },
    {
      ...(publicationTargets[1] as PublicationTarget),
      publications: [],
    },
    {
      ...(publicationTargets[2] as PublicationTarget),
      publications: [],
    },
  ];
