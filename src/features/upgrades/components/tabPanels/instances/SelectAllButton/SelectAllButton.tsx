import { FC } from "react";
import { Button, Icon } from "@canonical/react-components";

interface SelectAllButtonProps {
  count: number;
  onClick: () => void;
  totalCount: number;
}

const SelectAllButton: FC<SelectAllButtonProps> = ({
  count,
  onClick,
  totalCount,
}) => {
  return (
    <p className="u-no-margin--bottom u-no-padding--top u-text--muted">
      <Icon name="information" />
      <span>{` Selected ${count} ${count !== 1 ? "packages" : "package"} currently. `}</span>
      <Button appearance="link" onClick={onClick}>
        {`Select all ${totalCount} packages.`}
      </Button>
    </p>
  );
};

export default SelectAllButton;
