import type { FC } from "react";
import { useEffect } from "react";
import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import classes from "./LandscapeActions.module.scss";
import { APP_VERSION, FEEDBACK_LINK } from "../../../constants";
import classNames from "classnames";
import { TOOLTIP_MESSAGE } from "./constants";
import { redirectToExternalUrl, useAuthHandle } from "@landscape/context";

const LandscapeActions: FC = () => {
  const { getClassicDashboardUrlQuery } = useAuthHandle();

  const {
    data: getClassicDashboardUrlQueryResult,
    refetch: refetchClassicDashboardUrl,
  } = getClassicDashboardUrlQuery({}, { enabled: false });

  useEffect(() => {
    if (!getClassicDashboardUrlQueryResult) {
      return;
    }

    redirectToExternalUrl(getClassicDashboardUrlQueryResult.data.url);
  }, [getClassicDashboardUrlQueryResult]);

  return (
    <div className={classNames("is-fading-when-collapsed", classes.container)}>
      <ul className="p-list p-list--divided u-no-margin--bottom">
        <li className={classNames("p-list__item", classes.listItem)}>
          <span className={classes.titleRow}>
            <span>
              <span className={classes.title}>New web portal</span>
              <Tooltip position="right" message={TOOLTIP_MESSAGE}>
                <Icon name={ICONS.help} />
              </Tooltip>
            </span>
            <span className={classes.version}>{`v${APP_VERSION}`}</span>
          </span>
        </li>
        <li className={classNames("p-list__item", classes.listItem)}>
          <a
            href={FEEDBACK_LINK}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className={classes.feedbackLink}
          >
            Share your feedback
          </a>
        </li>
        <li className={classNames("p-list__item", classes.listItem)}>
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={refetchClassicDashboardUrl}
          >
            <span>Switch to classic dashboard</span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default LandscapeActions;
