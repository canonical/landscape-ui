import { Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";

const LoadingState: FC = () => {
  return (
    <div className="p-strip" role="status">
      <div className="u-align-text--center">
        <span className="u-off-screen">Loading...</span>
        <Icon name={ICONS.spinner} className="u-animation--spin" aria-hidden />
      </div>
    </div>
  );
};

export default LoadingState;
