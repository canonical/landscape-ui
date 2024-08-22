import { FC, ReactNode } from "react";
import { Button } from "@canonical/react-components";
import classes from "./ExpandableTableFooter.module.scss";
import classNames from "classnames";

interface ExpandableTableFooterProps {
  itemNames: {
    plural: string;
    singular: string;
  };
  limit: number;
  onLimitChange: () => void;
  totalCount: number;
  additionalCta?: ReactNode;
  viewAll?: boolean;
  className?: string;
}

const ExpandableTableFooter: FC<ExpandableTableFooterProps> = ({
  additionalCta,
  itemNames,
  limit,
  onLimitChange,
  totalCount,
  viewAll,
  className,
}) => {
  const itemsToShowCount = Math.min(totalCount - limit, 5);

  return (
    <div className={classNames(classes.container, className)}>
      {additionalCta}
      <div className={classes.expandBlock}>
        <span className="p-text--small u-text--muted">{`Showing ${Math.min(
          totalCount,
          limit,
        )} of ${totalCount} ${totalCount !== 1 ? itemNames.plural : itemNames.singular}.`}</span>
        {limit < totalCount && (
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
