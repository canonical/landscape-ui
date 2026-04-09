import type { PublicationTarget } from "./PublicationTarget";

export interface Publication extends Record<string, unknown> {
  name: string;
  publication_id: string;
  display_name: string;
  publication_target: string; // resource name of the PublicationTarget, e.g. "publicationTargets/{uuid}"
  mirror?: string; // resource name of the source mirror, e.g. "mirrors/{uuid}"
  distribution?: string;
}

export interface PublicationTargetWithPublications extends PublicationTarget {
  publications: Publication[];
}
