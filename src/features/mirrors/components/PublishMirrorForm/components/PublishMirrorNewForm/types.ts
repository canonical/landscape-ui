export interface FormProps {
  name: string;
  publication_target: string;
  signing_key: string;
  hash_indexing: boolean;
  automatic_installation: boolean;
  automatic_upgrades: boolean;
  skip_bz2: boolean;
  skip_content_indexing: boolean;
}
