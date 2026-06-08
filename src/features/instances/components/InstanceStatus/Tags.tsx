import type { FC, MouseEvent as ReactMouseEvent } from "react";
import { getTagStatuses } from "./helpers";
import StatusPills from "./StatusPills";

interface TagsProps {
  readonly tags: string[];
  /** When provided, each tag becomes a clickable filter affordance. */
  readonly onTagClick?: (tag: string) => void;
  /**
   * Renders the compact, expandable table-cell variant: the first tag stays
   * visible while the rest collapse behind a counter (matching the status
   * cell). When omitted, every tag is shown (used on the single instance view).
   */
  readonly expandable?: boolean;
  readonly isExpanded?: boolean;
  readonly onExpand?: (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

// Tags reuse the status chip styling so they read as the same family of
// metadata. They carry no severity, so they are rendered as neutral pills
// badged with the tag glyph.
const Tags: FC<TagsProps> = ({ tags, onTagClick, ...pillProps }) => (
  <StatusPills
    statuses={getTagStatuses(tags)}
    onStatusClick={
      onTagClick
        ? (status) => {
            onTagClick(status.filterValue ?? status.key);
          }
        : undefined
    }
    {...pillProps}
  />
);

export default Tags;
