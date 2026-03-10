import type { Profile, ComplianceInstanceCounts } from "@/features/profiles";

export interface WslProfile extends Profile {
  computers: ComplianceInstanceCounts;
  cloud_init_contents: string | null;
  cloud_init_secret_name: string | null;
  image_name: string;
  image_source: string | null;
  instance_type: string;
  only_landscape_created: boolean;
}
