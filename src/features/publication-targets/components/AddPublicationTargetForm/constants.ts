import type { FilesystemTargetLinkMethod } from "@canonical/landscape-openapi";

export type TargetType = "s3" | "swift" | "filesystem";

export interface AddPublicationTargetFormValues {
  displayName: string;
  targetType: TargetType;

  // S3
  region: string;
  bucket: string;
  endpoint: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  s3Prefix: string;
  acl: string;
  storageClass: string;
  encryptionMethod: string;
  disableMultiDel: boolean;
  forceSigV2: boolean;

  // Swift
  container: string;
  swiftUsername: string;
  swiftPassword: string;
  swiftPrefix: string;
  authUrl: string;
  tenant: string;
  tenantId: string;
  domain: string;
  domainId: string;
  tenantDomain: string;
  tenantDomainId: string;

  // Filesystem
  path: string;
  linkMethod: FilesystemTargetLinkMethod | "";
}

export const INITIAL_VALUES: AddPublicationTargetFormValues = {
  displayName: "",
  targetType: "s3",

  // S3
  region: "",
  bucket: "",
  endpoint: "",
  awsAccessKeyId: "",
  awsSecretAccessKey: "",
  s3Prefix: "",
  acl: "",
  storageClass: "",
  encryptionMethod: "",
  disableMultiDel: false,
  forceSigV2: false,

  // Swift
  container: "",
  swiftUsername: "",
  swiftPassword: "",
  swiftPrefix: "",
  authUrl: "",
  tenant: "",
  tenantId: "",
  domain: "",
  domainId: "",
  tenantDomain: "",
  tenantDomainId: "",

  // Filesystem
  path: "",
  linkMethod: "",
};
