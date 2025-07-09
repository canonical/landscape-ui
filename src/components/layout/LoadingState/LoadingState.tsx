import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./LoadingState.module.scss";
import classNames from "classnames";

interface LoadingStateProps {
  readonly centerOnScreen?: boolean;
}

const LoadingState: FC<LoadingStateProps> = ({ centerOnScreen }) => {
  return (
    <div
      className={classNames({
        [classes.root]: centerOnScreen,
      })}
    >
      <div className="p-strip" role="status">
        <div className="u-align-text--center">
          <span className="u-off-screen">Loading...</span>
          <Icon
            name={ICONS.spinner}
            className="u-animation--spin"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
