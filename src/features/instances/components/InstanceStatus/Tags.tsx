import type { FC } from "react";
import { getTagStatuses } from "./helpers";
import StatusPills from "./StatusPills";

interface TagsProps {
  readonly tags: string[];
  /** When provided, each tag becomes a clickable filter affordance. */
  readonly onTagClick?: (tag: string) => void;
}

// Tags reuse the status chip styling so they read as the same family of
// metadata. They carry no severity, so they are rendered as neutral pills
// badged with the tag glyph.
const Tags: FC<TagsProps> = ({ tags, onTagClick }) => (
  <StatusPills
    statuses={getTagStatuses(tags)}
    onStatusClick={
      onTagClick
        ? (status) => {
            onTagClick(status.label);
          }
        : undefined
    }
  />
);

export default Tags;
