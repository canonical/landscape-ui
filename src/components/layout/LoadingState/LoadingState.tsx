import { ROOT_PATH } from "@/constants";
import { getIconRootPath } from "@/libs/icons";
import { Spinner } from "@canonical/react-ds-global";
import type { FC } from "react";
import classes from "./LoadingState.module.scss";
import classNames from "classnames";

interface LoadingStateProps {
  readonly centerOnScreen?: boolean;
  readonly inline?: boolean;
}

const iconRootPath = getIconRootPath(ROOT_PATH);

const LoadingState: FC<LoadingStateProps> = ({ centerOnScreen, inline }) => {
  const spinningElement = (
    <>
      <span className="u-off-screen">Loading...</span>
      <Spinner rootPath={iconRootPath} />
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
