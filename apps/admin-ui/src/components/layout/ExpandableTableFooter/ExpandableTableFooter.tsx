import type { FC, ReactNode } from "react";
import { Button } from "@canonical/react-components";
import classes from "./ExpandableTableFooter.module.scss";
import classNames from "classnames";
import { pluralize } from "@/utils/_helpers";

interface ExpandableTableFooterProps {
  readonly itemCount: number;
  readonly itemNames: {
    plural: string;
    singular: string;
  };
  readonly onLimitChange: () => void;
  readonly totalCount: number;
  readonly additionalCta?: ReactNode;
  readonly className?: string;
  readonly hasNoMoreItems?: boolean;
  readonly viewAll?: boolean;
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
        {actualTotalCount > 0 && (
          <span className="p-text--small u-text--muted">{`Showing ${Math.min(
            actualTotalCount,
            itemCount,
          )} of ${actualTotalCount} ${pluralize(actualTotalCount, itemNames.singular, itemNames.plural)}.`}</span>
        )}
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
