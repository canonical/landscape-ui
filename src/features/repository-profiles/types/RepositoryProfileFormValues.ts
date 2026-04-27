import type { APTSource } from "@/features/apt-sources";
import type { CreateRepositoryProfileParams } from "../api";

export type RepositoryProfileFormValues = Omit<
  Required<CreateRepositoryProfileParams>,
  "apt_sources"
> & {
  apt_sources: APTSource[];
};
