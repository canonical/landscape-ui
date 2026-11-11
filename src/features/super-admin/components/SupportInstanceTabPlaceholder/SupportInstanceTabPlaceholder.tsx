import EmptyState from "@/components/layout/EmptyState";
import type { FC } from "react";

interface SupportInstanceTabPlaceholderProps {
  /** The tab's label, as shown in the tab list. */
  readonly tab: string;
}

/** Stands in for a tab that support sessions do not show yet. */
const SupportInstanceTabPlaceholder: FC<SupportInstanceTabPlaceholderProps> = ({
  tab,
}) => (
  <EmptyState
    title={`${tab} is not available yet`}
    body="This tab is not part of support sessions yet."
  />
);

export default SupportInstanceTabPlaceholder;
