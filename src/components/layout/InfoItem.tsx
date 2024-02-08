import { FC, ReactNode, useState } from "react";
import classes from "./InfoItem.module.scss";
import classNames from "classnames";
import { Button } from "@canonical/react-components";

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
  props: InfoItemMode,
  showMore: boolean,
): ReactNode => {
  switch (props.type) {
    case "regular":
    case undefined:
      return props.value;
    case "truncated":
      return showMore ? props.value : getTruncatedText(props.value);
    case "password":
      return "****************";
    default:
      return null;
  }
};

const shouldDisplayTruncation = (props: InfoItemMode): boolean => {
  return (
    props.type === "truncated" && props.value.length > TRUNCATED_TEXT_LENGTH
  );
};

interface InfoItemBaseProps {
  label: string;
  className?: string;
}

type TruncatedInfoItemProps = {
  type: "truncated";
  value: string;
};

type RegularInfoItemProps = {
  type?: "regular";
  value: ReactNode;
};

type PasswordInfoItemProps = {
  type: "password";
};

type InfoItemMode =
  | TruncatedInfoItemProps
  | RegularInfoItemProps
  | PasswordInfoItemProps;

export type InfoItemProps = InfoItemBaseProps & InfoItemMode;

const InfoItem: FC<InfoItemProps> = ({ label, className, ...props }) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const displayedContent = getContentDisplayed(props, showMore);
  const needsTruncation = shouldDisplayTruncation(props);

  return (
    <>
      <div
        className={classNames(classes.wrapper, className, {
          [classes.truncated]: needsTruncation,
        })}
      >
        <p className="p-text--small p-text--small-caps u-text--muted u-no-margin--bottom">
          {label}
        </p>
        <span>{displayedContent}</span>
      </div>
      {needsTruncation && (
        <Button
          appearance="base"
          small
          className={classNames("u-no-margin--right", classes.showMore)}
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </>
  );
};

export default InfoItem;
