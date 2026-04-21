import type { PublicationTarget } from "@canonical/landscape-openapi";

export const publicationTargets: PublicationTarget[] = [
  {
    name: "publicationTargets/prod-us",
    publicationTargetId: "prod-us",
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
    name: "publicationTargets/emea",
    publicationTargetId: "emea",
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
    name: "publicationTargets/swift-internal",
    publicationTargetId: "swift-internal",
    displayName: "swift-internal",
    swift: {
      container: "landscape-packages",
      username: "admin",
      password: "supersecret",
      authUrl: "https://keystone.example.com/v3",
      tenant: "landscape",
    },
  },
];
