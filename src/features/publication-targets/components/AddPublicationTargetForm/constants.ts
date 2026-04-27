export interface AddPublicationTargetFormValues {
  displayName: string;
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

export const INITIAL_VALUES: AddPublicationTargetFormValues = {
  displayName: "",
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
