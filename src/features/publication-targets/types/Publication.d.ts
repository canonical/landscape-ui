import type {
  Publication,
  PublicationTarget,
} from "@/api/generated/debArchive.schemas";

export type { Publication };

export interface PublicationTargetWithPublications extends PublicationTarget {
  publications: Publication[];
}
