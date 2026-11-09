import type { LinkComponentProps } from "@canonical/react-ds-global";
import type { FC, ReactNode } from "react";
import { createContext, use } from "react";
import { Link } from "react-router";

/**
 * Rich label content keyed by plain-text label. Pragma types tab labels as
 * strings (`Item.label` in `@canonical/ds-types`), so rich content is supplied
 * through the link renderer instead. Remove once Pragma's `TabItem` gains a
 * rich-content slot (e.g. `badge?: ReactNode`) alongside the plain-text label.
 */
export const TabLabelContentContext = createContext<
  ReadonlyMap<string, ReactNode>
>(new Map());

/**
 * Pragma `LinkComponent` for tabs. Tab switches replace the history entry,
 * matching the URL writes made through `usePageParams`.
 */
const TabLink: FC<LinkComponentProps> = ({ href, children, ...props }) => {
  const labelContent = use(TabLabelContentContext);
  const content =
    typeof children === "string"
      ? (labelContent.get(children) ?? children)
      : children;

  if (!href) {
    return (
      <a role="link" aria-disabled="true" {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} replace {...props}>
      {content}
    </Link>
  );
};

export default TabLink;
