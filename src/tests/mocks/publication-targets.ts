import type { PublicationTarget, Publication } from "@canonical/landscape-openapi";

export const publications: Publication[] = [
  {
    name: "publications/11111111-0000-0000-0000-000000000001",
    publicationId: "11111111-0000-0000-0000-000000000001",
    publicationTarget: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    mirror: "mirrors/mirror-jammy-001",
    distribution: "jammy",
    label: "Ubuntu 22.04 LTS (Jammy)",
  },
  {
    name: "publications/22222222-0000-0000-0000-000000000002",
    publicationId: "22222222-0000-0000-0000-000000000002",
    publicationTarget: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    mirror: "mirrors/mirror-noble-001",
    distribution: "noble",
    label: "Ubuntu 24.04 LTS (Noble)",
  },
  {
    name: "publications/33333333-0000-0000-0000-000000000003",
    publicationId: "33333333-0000-0000-0000-000000000003",
    publicationTarget: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    mirror: "mirrors/mirror-focal-001",
    distribution: "focal",
    label: "Ubuntu 20.04 LTS (Focal)",
  },
];

export const publicationTargets: PublicationTarget[] = [
  {
    name: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
    publicationTargetId: "aaaaaaaa-0000-0000-0000-000000000001",
    displayName: "prod-s3-us-east",
    s3: {
      region: "us-east-1",
      bucket: "landscape-prod-packages",
      awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE",
      awsSecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      prefix: "ubuntu/",
      acl: "private",
      storageClass: "STANDARD",
      encryptionMethod: "AES256",
      disableMultiDel: false,
      forceSigV2: false,
    },
  },
  {
    name: "publicationTargets/bbbbbbbb-0000-0000-0000-000000000002",
    publicationTargetId: "bbbbbbbb-0000-0000-0000-000000000002",
    displayName: "staging-s3-eu-west",
    s3: {
      region: "eu-west-1",
      bucket: "landscape-staging-packages",
      awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE2",
      awsSecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2",
      disableMultiDel: true,
      forceSigV2: false,
    },
  },
  {
    name: "publicationTargets/cccccccc-0000-0000-0000-000000000003",
    publicationTargetId: "cccccccc-0000-0000-0000-000000000003",
    displayName: "",
    swift: {
      container: "landscape-packages",
      username: "admin",
      password: "supersecret",
      authUrl: "https://keystone.example.com/v3",
      tenant: "landscape",
    },
  },
];
