import { FC, Fragment, ReactNode, useState } from "react";
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
  props: InfoItemProps,
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
    case "snippet":
      return (
        <div className="p-code-snippet">
          <div className="p-code-snippet__header">
            <h5 className="p-code-snippet__title">{props.label}</h5>
          </div>
          <pre className="p-code-snippet__block">
            <code>
              {props.value
                .replace(/\\r/g, "")
                .split("\\n")
                .map((str, index) => (
                  <Fragment key={index}>
                    {str}
                    <br />
                  </Fragment>
                ))}
            </code>
          </pre>
        </div>
      );
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

type SnippetInfoItemProps = {
  type: "snippet";
  value: string;
};

type InfoItemMode =
  | TruncatedInfoItemProps
  | RegularInfoItemProps
  | PasswordInfoItemProps
  | SnippetInfoItemProps;

export type InfoItemProps = InfoItemBaseProps & InfoItemMode;

const InfoItem: FC<InfoItemProps> = (props) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const displayedContent = getContentDisplayed(props, showMore);
  const needsTruncation = shouldDisplayTruncation(props);

  return props.type === "snippet" ? (
    <div className={classes.snippetRoot}>{displayedContent}</div>
  ) : (
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
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </>
  );
};

export default InfoItem;
