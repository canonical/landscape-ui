import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./LoadingState.module.scss";
import classNames from "classnames";

interface LoadingStateProps {
  readonly centerOnScreen?: boolean;
  readonly inline?: boolean;
}

const LoadingState: FC<LoadingStateProps> = ({ centerOnScreen, inline }) => {
  const spinningElement = (
    <>
      <span className="u-off-screen">Loading...</span>
      <Icon name={ICONS.spinner} className="u-animation--spin" aria-hidden />
    </>
  );

  if (inline) {
    return <span role="status">{spinningElement}</span>;
  }

  return (
    <div className={classNames({ [classes.root as string]: centerOnScreen })}>
      <div className="p-strip" role="status">
        <div className="u-align-text--center">{spinningElement}</div>
      </div>
    </div>
  );
};

export default LoadingState;
