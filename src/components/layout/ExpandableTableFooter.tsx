import { FC } from "react";
import { Button } from "@canonical/react-components";
import classes from "./ExpandableTableFooter.module.scss";

interface ExpandableTableFooterProps {
  buttonText: string;
  itemName: string;
  limit: number;
  onClick: () => void;
  total: number;
}

const ExpandableTableFooter: FC<ExpandableTableFooterProps> = ({
  buttonText,
  itemName,
  limit,
  onClick,
  total,
}) => {
  return (
    <div className={classes.more}>
      <span className="p-text--small u-text--muted">{`Showing ${Math.min(
        total,
        limit,
      )} of ${total} ${itemName}s.`}</span>
      {limit < total && (
        <Button type="button" small dense onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ExpandableTableFooter;
