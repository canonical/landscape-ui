import { FC } from "react";
import { Button, Icon } from "@canonical/react-components";

interface SelectAllButtonProps {
  count: number;
  itemName: {
    plural: string;
    singular: string;
  };
  onClick: () => void;
  totalCount: number;
}

const SelectAllButton: FC<SelectAllButtonProps> = ({
  count,
  itemName: { plural, singular },
  onClick,
  totalCount,
}) => {
  return (
    <p className="u-no-margin--bottom u-no-padding--top u-text--muted">
      <Icon name="information" />
      <span>{` Selected ${count} ${count !== 1 ? plural : singular} currently. `}</span>
      <Button appearance="link" onClick={onClick}>
        {`Select all ${totalCount} ${plural}.`}
      </Button>
    </p>
  );
};

export default SelectAllButton;
