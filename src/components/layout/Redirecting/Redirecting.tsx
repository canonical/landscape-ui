import { FC } from "react";

const Redirecting: FC = () => {
  return (
    <div className="u-align-text--center">
      <span role="status" style={{ marginRight: "1rem" }}>
        <span className="u-off-screen">Redirecting...</span>
        <i className="p-icon--spinner u-animation--spin" aria-hidden />
      </span>
      <span>Redirecting...</span>
    </div>
  );
};

export default Redirecting;
