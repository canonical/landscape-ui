import { FC } from "react";

const LoadingState: FC = () => {
  return (
    <div className="p-strip" role="status">
      <div className="u-align-text--center">
        <span className="u-off-screen">Loading...</span>
        <i className="p-icon--spinner u-animation--spin" aria-hidden />
      </div>
    </div>
  );
};

export default LoadingState;
