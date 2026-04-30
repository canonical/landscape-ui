import type { FilesystemTargetLinkMethod } from "@canonical/landscape-openapi";
import * as Yup from "yup";

export interface EditTargetFormValues {
  displayName: string;
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

export const EMPTY_VALUES: EditTargetFormValues = {
  displayName: "",
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
  path: "",
  linkMethod: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  displayName: Yup.string().required("This field is required"),
});

export const LINK_METHOD_OPTIONS = [
  { value: "HARDLINK", label: "Hardlink" },
  { value: "SYMLINK", label: "Symlink" },
  { value: "COPY", label: "Copy" },
];

export const TARGET_TYPE_LABELS: Record<"s3" | "swift" | "filesystem", string> =
  {
    s3: "S3",
    swift: "Swift",
    filesystem: "Filesystem",
  };
