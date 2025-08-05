import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, MouseEvent as ReactMouseEvent, ReactNode, Ref } from "react";
import { useState } from "react";
import classes from "./Truncated.module.scss";

interface TruncatedProps {
  readonly content: ReactNode;
  readonly expandedClassName: string;
  readonly isExpanded: boolean;
  readonly onExpand: (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  readonly showCount?: boolean;
}

const Truncated: FC<TruncatedProps> = ({
  content,
  expandedClassName,
  isExpanded,
  onExpand,
  showCount,
}) => {
  const [overflownChildCount, setOverflownChildCount] = useState<
    number | undefined
  >(undefined);

  const expandabilityCheck = (
    element: HTMLElement,
    parentElement: HTMLElement,
  ) => {
    setOverflownChildCount(
      [...element.childNodes].filter((child) => {
        const range = document.createRange();
        range.selectNodeContents(child);

        return (
          range.getBoundingClientRect().right >
          parentElement.getBoundingClientRect().right
        );
      }).length,
    );
  };

  const initialCheck: Ref<HTMLElement> = (element) => {
    const parentElement = element?.parentElement;

    if (!parentElement) {
      return;
    }

    expandabilityCheck(element, parentElement);

    const observer = new ResizeObserver(() => {
      expandabilityCheck(element, parentElement);
    });

    observer.observe(parentElement);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <div className={classNames({ [classes.container]: isExpanded })}>
      <div
        className={
          isExpanded
            ? classNames(classes.expanded, expandedClassName)
            : classes.collapsed
        }
      >
        <span
          ref={initialCheck}
          className={isExpanded ? classes.expandedContent : classes.truncated}
        >
          {content}
        </span>
        {!!overflownChildCount && !isExpanded && (
          <Button
            type="button"
            appearance="link"
            className={classNames(
              "p-text--small u-no-margin--bottom",
              classes.button,
            )}
            onClick={onExpand}
          >
            <span className={classNames("u-text--muted", classes.buttonText)}>
              {showCount ? `+${overflownChildCount}` : "Show more"}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Truncated;
