import type { APTSource } from "@/features/apt-sources";
import type { Profile } from "@/features/profiles";

export interface RepositoryProfile extends Profile, Record<string, unknown> {
  applied_count: number;
  apt_sources: APTSource[];
  pending_count: number;
}
