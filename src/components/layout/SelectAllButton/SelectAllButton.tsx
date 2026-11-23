import type { FC } from "react";
import { Icon } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import { pluralize } from "@/utils/_helpers";

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
      <span className="u-text--muted">{` Selected ${pluralize(count, [singular, plural], "exact")} currently. `}</span>
      <Button type="button" variant="link" onClick={onClick}>
        {`Select all ${totalCount} ${plural}.`}
      </Button>
    </div>
  );
};

export default SelectAllButton;
