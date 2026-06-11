import type { FC } from "react";
import {
  ActionButton,
  Icon,
  ICONS,
  Tooltip,
} from "@canonical/react-components";
import classes from "./LandscapeActions.module.scss";
import { FEEDBACK_LINK } from "@/constants";
import classNames from "classnames";
import { TOOLTIP_MESSAGE } from "./constants";
import { useRedirectToClassicDashboard } from "@/hooks/useRedirectToClassicDashboard";

const LandscapeActions: FC = () => {
  const { redirectToClassicDashboard, isRedirectingToClassicDashboard } =
    useRedirectToClassicDashboard();

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
        <li className={classNames("p-list__item", classes.listItem)}>
          <ActionButton
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={redirectToClassicDashboard}
            loading={isRedirectingToClassicDashboard}
          >
            <span>Switch to classic dashboard</span>
          </ActionButton>
        </li>
      </ul>
    </div>
  );
};

export default LandscapeActions;
