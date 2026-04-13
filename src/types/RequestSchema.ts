export interface RequestSchema {
  access_key_id: string;
  action: string;
  signature_method: string;
  signature_version: string;
  timestamp: string;
  version: string;
  signature: string;

  [key: string]: string | object[];
}
