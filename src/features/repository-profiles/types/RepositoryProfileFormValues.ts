import type { APTSource } from "./APTSource";
import type { CreateRepositoryProfileParams } from "../api";

export type RepositoryProfileFormValues = Omit<
  Required<CreateRepositoryProfileParams>,
  "apt_sources"
> & {
  apt_sources: APTSource[];
};
