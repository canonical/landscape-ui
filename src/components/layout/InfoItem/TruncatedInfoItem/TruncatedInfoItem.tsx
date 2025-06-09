import classNames from "classnames";
import { useRef, type FC } from "react";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import TruncatedCell from "../../TruncatedCell";
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
            [classes.expandedCell]: isExpanded,
            [classes.expandedRow]: isExpanded,
          })}
          ref={ref}
        >
          <TruncatedCell
            content={value}
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
