import type { FilesystemTargetLinkMethod } from "@canonical/landscape-openapi";

export type TargetType = "s3" | "swift" | "filesystem";

export interface S3FormValues {
  region: string;
  bucket: string;
  endpoint: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  prefix: string;
  acl: string;
  storageClass: string;
  encryptionMethod: string;
  disableMultiDel: boolean;
  forceSigV2: boolean;
}

export interface SwiftFormValues {
  container: string;
  username: string;
  password: string;
  prefix: string;
  authUrl: string;
  tenant: string;
  tenantId: string;
  domain: string;
  domainId: string;
  tenantDomain: string;
  tenantDomainId: string;
}

export interface FilesystemFormValues {
  path: string;
  linkMethod: FilesystemTargetLinkMethod | "";
}

export interface AddPublicationTargetFormValues {
  displayName: string;
  targetType: TargetType;
  s3: S3FormValues;
  swift: SwiftFormValues;
  filesystem: FilesystemFormValues;
}

export const S3_INITIAL_VALUES: S3FormValues = {
  region: "",
  bucket: "",
  endpoint: "",
  awsAccessKeyId: "",
  awsSecretAccessKey: "",
  prefix: "",
  acl: "",
  storageClass: "",
  encryptionMethod: "",
  disableMultiDel: false,
  forceSigV2: false,
};

export const SWIFT_INITIAL_VALUES: SwiftFormValues = {
  container: "",
  username: "",
  password: "",
  prefix: "",
  authUrl: "",
  tenant: "",
  tenantId: "",
  domain: "",
  domainId: "",
  tenantDomain: "",
  tenantDomainId: "",
};

export const FILESYSTEM_INITIAL_VALUES: FilesystemFormValues = {
  path: "",
  linkMethod: "",
};

export const INITIAL_VALUES: AddPublicationTargetFormValues = {
  displayName: "",
  targetType: "s3",
  s3: S3_INITIAL_VALUES,
  swift: SWIFT_INITIAL_VALUES,
  filesystem: FILESYSTEM_INITIAL_VALUES,
};
