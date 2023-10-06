export interface GPGKey extends Record<string, unknown> {
  fingerprint: string;
  has_secret: boolean;
  id: number;
  key_id: string;
  name: string;
}

export interface UploadedGPGKey {
  fingerprint: string;
  has_secret: boolean;
  id: number;
  name: string;
}
