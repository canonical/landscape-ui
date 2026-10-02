import type { FC } from "react";
import classes from "./LandscapeActions.module.scss";
import { FEEDBACK_LINK } from "@/constants";
import classNames from "classnames";
import { useAuthHandle } from "@/features/auth";
import LoadingState from "@/components/layout/LoadingState";
import { Link } from "react-router";

const LandscapeActions: FC = () => {
  const { getClassicDashboardUrlQuery } = useAuthHandle();

  const { data, isLoading } = getClassicDashboardUrlQuery();

  return (
    <div className={classNames("is-fading-when-collapsed", classes.container)}>
      <ul className="p-list p-list--divided u-no-margin--bottom">
        <li className={classNames("p-list__item", classes.listItem)}>
          <a
            href={FEEDBACK_LINK}
            target="_blank"
            rel="noreferrer noopener nofollow"
          >
            Share your feedback
          </a>
        </li>
        {isLoading && (
          <li className={classNames("p-list__item", classes.listItem)}>
            <LoadingState inline />
          </li>
        )}
        {data && (
          <li className={classNames("p-list__item", classes.listItem)}>
            <Link to={data.data.url}>Switch to legacy portal</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LandscapeActions;
