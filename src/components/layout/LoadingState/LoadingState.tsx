import { Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, Ref } from "react";
import classes from "./LoadingState.module.scss";

interface LoadingStateProps {
  readonly centerOnScreen?: boolean;
  readonly ref?: Ref<HTMLDivElement>;
}

const LoadingState: FC<LoadingStateProps> = ({ centerOnScreen, ref }) => {
  return (
    <div
      className={classNames({
        [classes.root]: centerOnScreen,
      })}
      ref={ref}
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
