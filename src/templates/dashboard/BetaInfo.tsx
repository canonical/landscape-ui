import { FC } from "react";
import classes from "./BetaInfo.module.scss";
import { Link } from "react-router-dom";

const BetaInfo: FC = () => {
  return (
    <div className={classes.container}>
      <p className="p-muted-heading u-no-padding--top u-no-margin--bottom">
        Beta version
      </p>
      <Link to={"https://discourse.canonical.com/"} className={classes.link}>
        <span>Feedback</span>
        <i
          className={`p-icon--external-link is-light p-side-navigation__icon`}
        />
      </Link>
    </div>
  );
};

export default BetaInfo;
