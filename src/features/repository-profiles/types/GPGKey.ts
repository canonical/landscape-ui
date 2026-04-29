export interface GPGKey {
  fingerprint: string;
  has_secret: boolean;
  id: number;
  key_id: string;
  name: string;
}
