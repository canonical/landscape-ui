import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, Ref } from "react";
import { useBoolean } from "usehooks-ts";
import type { RegularInfoItemProps } from "../RegularInfoItem";
import RegularInfoItem from "../RegularInfoItem";
import classes from "./TruncatedInfoItem.module.scss";

export type TruncatedInfoItemProps = RegularInfoItemProps;

const TruncatedInfoItem: FC<TruncatedInfoItemProps> = ({
  className,
  value,
  ...props
}) => {
  const { value: isShowingTruncation, setValue: setIsShowingTruncation } =
    useBoolean();
  const { value: isExpanded, toggle } = useBoolean();

  const checkTruncation: Ref<Element> = (element) => {
    if (isExpanded || !element?.firstChild) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(element.firstChild);

    setIsShowingTruncation(
      range.getBoundingClientRect().bottom >
        element.getBoundingClientRect().bottom,
    );
  };

  return (
    <>
      <RegularInfoItem
        className={classNames(className, {
          [classes.truncated]: isShowingTruncation,
        })}
        value={
          <span
            ref={checkTruncation}
            className={isExpanded ? undefined : classes.truncatedContent}
          >
            {value}
          </span>
        }
        {...props}
      />

      {isShowingTruncation && (
        <Button
          type="button"
          appearance="base"
          small
          className={classNames("u-no-margin--right", classes.showMore)}
          onClick={toggle}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </>
  );
};

export default TruncatedInfoItem;
