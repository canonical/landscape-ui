import type { APTSource } from "./APTSource";
import type { Profile } from "@/features/profiles";

export interface RepositoryProfile extends Profile {
  apt_sources: APTSource[];
  pending_count: number;
}
