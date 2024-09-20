export interface WslProfile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  computers: {
    constrained: number[];
    "non-compliant": number[];
    pending: number[];
  };
  cloud_init_contents: string | null;
  cloud_init_secret_name: string | null;
  description: string;
  id: number;
  image_name: string;
  image_source: string | null;
  instance_type: string;
  name: string;
  tags: string[];
  title: string;
}
