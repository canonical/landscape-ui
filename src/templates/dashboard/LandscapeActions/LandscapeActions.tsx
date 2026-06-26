import type { FC } from "react";
import { Icon, ICONS, Tooltip } from "@canonical/react-components";
import classes from "./LandscapeActions.module.scss";
import { FEEDBACK_LINK } from "@/constants";
import classNames from "classnames";
import { TOOLTIP_MESSAGE } from "./constants";
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
          <span className={classes.title}>New web portal</span>
          <Tooltip position="right" message={TOOLTIP_MESSAGE}>
            <Icon name={ICONS.help} />
          </Tooltip>
        </li>
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
            <Link to={data.data.url}>Switch to classic dashboard</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LandscapeActions;
