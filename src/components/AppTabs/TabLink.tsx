import type { LinkComponentProps } from "@canonical/react-ds-global";
import type { FC } from "react";
import { Link } from "react-router";
import { useLabelWithSlot } from "./TabSlotShim";

/**
 * Pragma `LinkComponent` for tabs. Tab switches replace the history entry,
 * matching the URL writes made through `usePageParams`.
 */
const TabLink: FC<LinkComponentProps> = ({ href, children, ...props }) => {
  const content = useLabelWithSlot(children);

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
