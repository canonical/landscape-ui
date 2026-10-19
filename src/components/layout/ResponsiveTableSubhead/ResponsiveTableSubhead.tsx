import type { FC } from "react";
import classes from "./ResponsiveTableSubhead.module.scss";
import { pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";

type ResponsiveTableSubheadProps = {
  readonly selectedCount: number;
  readonly totalCount: number;
  readonly itemName: string;
  readonly onClearSelection: () => void;
  readonly isAllSelected?: boolean;
  readonly onSelectAll?: () => void;
} & (
  | {
      readonly canSelectAll: true;
      readonly isAllSelected?: boolean;
      readonly onSelectAll: () => void;
    }
  | {
      readonly canSelectAll?: false;
    }
);

const ResponsiveTableSubhead: FC<ResponsiveTableSubheadProps> = ({
  canSelectAll,
  selectedCount,
  totalCount,
  itemName,
  isAllSelected,
  onClearSelection,
  onSelectAll,
}) => {
  const pluralName = pluralize(totalCount, [itemName], "exact");

  return (
    <div className={classes.subhead}>
      <span aria-live="polite">
        {isAllSelected
          ? `All ${pluralName} selected`
          : `${selectedCount} of ${pluralName} selected`}
      </span>
      <div className={classes.buttons}>
        {canSelectAll && !isAllSelected && (
          <Button
            className="u-no-padding u-no-margin"
            appearance="link"
            onClick={onSelectAll}
          >
            Select all {pluralName}
          </Button>
        )}
        <Button
          className="u-no-padding u-no-margin"
          appearance="link"
          onClick={onClearSelection}
        >
          Clear selection
        </Button>
      </div>
    </div>
  );
};

export default ResponsiveTableSubhead;
