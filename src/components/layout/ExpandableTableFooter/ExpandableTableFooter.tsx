import { FC, ReactNode } from "react";
import { Button } from "@canonical/react-components";
import classes from "./ExpandableTableFooter.module.scss";
import classNames from "classnames";

interface ExpandableTableFooterProps {
  itemCount: number;
  itemNames: {
    plural: string;
    singular: string;
  };
  onLimitChange: () => void;
  totalCount: number;
  additionalCta?: ReactNode;
  className?: string;
  hasNoMoreItems?: boolean;
  viewAll?: boolean;
}

const ExpandableTableFooter: FC<ExpandableTableFooterProps> = ({
  additionalCta,
  hasNoMoreItems,
  itemCount,
  itemNames,
  onLimitChange,
  totalCount,
  viewAll,
  className,
}) => {
  const actualTotalCount = hasNoMoreItems ? itemCount : totalCount;

  const itemsToShowCount = Math.min(actualTotalCount - itemCount, 5);

  return (
    <div className={classNames(classes.container, className)}>
      {additionalCta}
      <div className={classes.expandBlock}>
        <span className="p-text--small u-text--muted">{`Showing ${Math.min(
          actualTotalCount,
          itemCount,
        )} of ${actualTotalCount} ${actualTotalCount !== 1 ? itemNames.plural : itemNames.singular}.`}</span>
        {itemCount < actualTotalCount && (
          <Button
            type="button"
            small
            dense
            className={classes.expandButton}
            onClick={onLimitChange}
          >
            {viewAll ? "View all" : `Show ${itemsToShowCount} more`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpandableTableFooter;
