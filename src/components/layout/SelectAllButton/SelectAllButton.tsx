import type { FC } from "react";
import { Button, Icon } from "@canonical/react-components";

interface SelectAllButtonProps {
  readonly count: number;
  readonly itemName: {
    plural: string;
    singular: string;
  };
  readonly onClick: () => void;
  readonly totalCount: number;
}

const SelectAllButton: FC<SelectAllButtonProps> = ({
  count,
  itemName: { plural, singular },
  onClick,
  totalCount,
}) => {
  return (
    <div>
      <Icon name="information" />
      <span className="u-text--muted">{` Selected ${count} ${count !== 1 ? plural : singular} currently. `}</span>
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top"
        onClick={onClick}
      >
        {`Select all ${totalCount} ${plural}.`}
      </Button>
    </div>
  );
};

export default SelectAllButton;
