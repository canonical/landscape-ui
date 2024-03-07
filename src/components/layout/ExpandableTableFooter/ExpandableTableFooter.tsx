import { FC, ReactNode } from "react";
import { Button } from "@canonical/react-components";
import classes from "./ExpandableTableFooter.module.scss";

interface ExpandableTableFooterProps {
  itemNames: {
    plural: string;
    singular: string;
  };
  limit: number;
  onLimitChange: () => void;
  totalCount: number;
  additionalCta?: ReactNode[];
}

const ExpandableTableFooter: FC<ExpandableTableFooterProps> = ({
  additionalCta,
  itemNames,
  limit,
  onLimitChange,
  totalCount,
}) => {
  const itemsToShowCount = Math.min(totalCount - limit, 5);

  return (
    <div className={classes.container}>
      {additionalCta}
      <div className={classes.expandBlock}>
        <span className="p-text--small u-text--muted">{`Showing ${Math.min(
          totalCount,
          limit,
        )} of ${totalCount} ${totalCount > 1 ? itemNames.plural : itemNames.singular}.`}</span>
        {limit < totalCount && (
          <Button
            type="button"
            small
            dense
            className={classes.expandButton}
            onClick={onLimitChange}
          >
            {`Show ${itemsToShowCount} more`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpandableTableFooter;
