import { FC } from "react";
import classes from "./BetaInfo.module.scss";
import classNames from "classnames";

const BetaInfo: FC = () => {
  return (
    <div className={classes.container}>
      <p className="p-muted-heading u-no-padding--top u-no-margin--bottom">
        Beta version
      </p>
      <p className={classNames("p-text--small", classes.description)}>
        We appreciate your input! Help us improve Landscape by providing your
        feedback.
      </p>
      <a
        href="https://discourse.ubuntu.com/t/feedback-on-landscape-beta/38655"
        className={classes.link}
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <span>Send feedback</span>
        <i
          className={`p-icon--external-link is-light p-side-navigation__icon`}
        />
      </a>
    </div>
  );
};

export default BetaInfo;
