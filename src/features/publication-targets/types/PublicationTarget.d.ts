export interface S3Target {
  region?: string;
  bucket: string;
  endpoint?: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  prefix?: string;
  acl?: string;
  storage_class?: string;
  encryption_method?: string;
  disable_multi_del?: boolean;
  force_sig_v2?: boolean;
}

export interface SwiftTarget {
  container: string;
  username: string;
  password: string;
  prefix?: string;
  auth_url?: string;
  tenant?: string;
  tenant_id?: string;
  domain?: string;
  domain_id?: string;
  tenant_domain?: string;
  tenant_domain_id?: string;
}

export interface PublicationTarget {
  name: string;
  publication_target_id: string;
  display_name?: string;
  s3?: S3Target;
  swift?: SwiftTarget;
}
