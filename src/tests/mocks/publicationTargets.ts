import type { PublicationTarget } from "@canonical/landscape-openapi";

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
    displayName: "swift-internal",
    swift: {
      container: "landscape-packages",
      username: "admin",
      password: "supersecret",
      authUrl: "https://keystone.example.com/v3",
      tenant: "landscape",
    },
  },
  {
    name: "publicationTargets/dddddddd-0000-0000-0000-000000000004",
    publicationTargetId: "dddddddd-0000-0000-0000-000000000004",
    displayName: "local-fs-archive",
    filesystem: {
      path: "/srv/landscape/archives",
      linkMethod: "HARDLINK",
    },
  },
];
