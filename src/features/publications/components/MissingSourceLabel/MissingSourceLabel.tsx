import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";

interface MissingSourceLabelProps {
  readonly className?: string;
  readonly iconClassName?: string;
}

const MissingSourceLabel: FC<MissingSourceLabelProps> = ({
  className,
  iconClassName,
}) => {
  const resolvedIconClassName = ["u-margin-right--x-small", iconClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className}>
      <Icon name={ICONS.warning} className={resolvedIconClassName} />
      <span>Source not found</span>
    </span>
  );
};

export default MissingSourceLabel;
