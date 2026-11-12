import { TooltipEngine } from "@canonical/react-ds-global";
import classNames from "classnames";
import { useReducer, type FC } from "react";
import classes from "./Tooltip.module.scss";
import type { TooltipProps } from "./types";

const isEmptyMessage = (message: TooltipProps["message"]): boolean =>
  message === undefined ||
  message === null ||
  typeof message === "boolean" ||
  message === "";

const Tooltip: FC<TooltipProps> = ({
  autoFit = true,
  children,
  className,
  message,
  messageElementClassName,
  onShow,
  preferredDirections,
  style,
  targetElementClassName,
  targetElementId,
  targetElementStyle,
  ...popupOptions
}) => {
  // Ensure `useWindowFitment` re-evaluates `bestPosition` once the portalled
  // popup ref is attached, even in zero-sized layout environments such as jsdom.
  const [, refreshPlacement] = useReducer((count: number) => count + 1, 0);

  if (isEmptyMessage(message)) {
    if (targetElementClassName || targetElementStyle || targetElementId) {
      return (
        <span className={className} style={style}>
          <span
            id={targetElementId}
            className={targetElementClassName}
            style={targetElementStyle}
          >
            {children}
          </span>
        </span>
      );
    }

    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }

  return (
    <TooltipEngine
      autoFit={autoFit}
      className={classNames(classes.area, className)}
      Message={message}
      messageElementClassName={classNames(
        classes.message,
        messageElementClassName,
      )}
      onShow={(event) => {
        if (preferredDirections) {
          refreshPlacement();
        }
        onShow?.(event);
      }}
      preferredDirections={
        preferredDirections ? [...preferredDirections] : undefined
      }
      style={style}
      targetElementClassName={targetElementClassName}
      targetElementId={targetElementId}
      targetElementStyle={targetElementStyle}
      {...popupOptions}
    >
      {children}
    </TooltipEngine>
  );
};

export default Tooltip;
