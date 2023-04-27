import { FC } from "react";

const LoadingState: FC = () => {
  return (
    <div className="p-strip">
      <div className="u-align-text--center">
        <i className="p-icon--spinner u-animation--spin" aria-hidden />
      </div>
    </div>
  );
};

export default LoadingState;
