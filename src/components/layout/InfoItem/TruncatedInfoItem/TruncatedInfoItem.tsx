import classNames from "classnames";
import { useRef, type FC } from "react";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import Truncated from "../../Truncated";
import type { RegularInfoItemProps } from "../RegularInfoItem";
import RegularInfoItem from "../RegularInfoItem";
import classes from "./TruncatedInfoItem.module.scss";

export type TruncatedInfoItemProps = RegularInfoItemProps;

const TruncatedInfoItem: FC<TruncatedInfoItemProps> = ({ value, ...props }) => {
  const {
    value: isExpanded,
    setTrue: expand,
    setFalse: collapse,
  } = useBoolean();

  const ref = useRef(null);

  useOnClickOutside(ref, collapse);

  return (
    <RegularInfoItem
      value={
        <div
          className={classNames({
            [classes.container]: isExpanded,
          })}
          ref={ref}
        >
          <Truncated
            content={value}
            expandedClassName={classes.expanded}
            isExpanded={isExpanded}
            onExpand={expand}
          />
        </div>
      }
      {...props}
    />
  );
};

export default TruncatedInfoItem;
