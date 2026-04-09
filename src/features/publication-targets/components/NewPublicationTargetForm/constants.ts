export interface NewPublicationTargetFormValues {
  display_name: string;
  region: string;
  bucket: string;
  endpoint: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  prefix: string;
  acl: string;
  storage_class: string;
  encryption_method: string;
  disable_multi_del: boolean;
  force_sig_v2: boolean;
}

export const INITIAL_VALUES: NewPublicationTargetFormValues = {
  display_name: "",
  region: "",
  bucket: "",
  endpoint: "",
  aws_access_key_id: "",
  aws_secret_access_key: "",
  prefix: "",
  acl: "",
  storage_class: "",
  encryption_method: "",
  disable_multi_del: false,
  force_sig_v2: false,
};
