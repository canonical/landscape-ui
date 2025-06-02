import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import classes from "./InfoItem.module.scss";

const TRUNCATED_TEXT_LENGTH = 120;

const getTruncatedText = (text: string): string => {
  if (text.length <= TRUNCATED_TEXT_LENGTH) {
    return text;
  } else {
    const truncatedText = text.slice(0, TRUNCATED_TEXT_LENGTH);
    return truncatedText + "...";
  }
};

const getContentDisplayed = (
  props: InfoItemProps,
  showMore: boolean,
): ReactNode => {
  switch (props.type) {
    case "truncated":
      return showMore ? props.value : getTruncatedText(props.value);
    case "password":
      return "****************";
    default:
      return props.value;
  }
};

const shouldDisplayTruncation = (props: InfoItemMode): boolean => {
  return (
    props.type === "truncated" && props.value.length > TRUNCATED_TEXT_LENGTH
  );
};

interface InfoItemBaseProps {
  readonly label: string;
  readonly className?: string;
}

interface TruncatedInfoItemProps {
  type: "truncated";
  value: string;
}

interface RegularInfoItemProps {
  type?: "regular";
  value: ReactNode;
}

interface PasswordInfoItemProps {
  type: "password";
}

type InfoItemMode =
  | TruncatedInfoItemProps
  | RegularInfoItemProps
  | PasswordInfoItemProps;

export type InfoItemProps = InfoItemBaseProps & InfoItemMode;

const InfoItem: FC<InfoItemProps> = (props) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const displayedContent = getContentDisplayed(props, showMore);
  const needsTruncation = shouldDisplayTruncation(props);

  return (
    <>
      <div
        className={classNames(classes.wrapper, props.className, {
          [classes.truncated]: needsTruncation,
        })}
      >
        <p className="p-text--small p-text--small-caps u-text--muted u-no-margin--bottom">
          {props.label}
        </p>
        <span>{displayedContent}</span>
      </div>
      {needsTruncation && (
        <Button
          type="button"
          appearance="base"
          small
          className={classNames("u-no-margin--right", classes.showMore)}
          onClick={() => {
            setShowMore((prev) => !prev);
          }}
        >
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </>
  );
};

export default InfoItem;
