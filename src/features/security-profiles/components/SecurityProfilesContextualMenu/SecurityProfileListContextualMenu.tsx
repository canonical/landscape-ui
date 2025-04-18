import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import { type FC } from "react";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";
import classes from "./SecurityProfileListContextualMenu.module.scss";

interface SecurityProfileListContextualMenuProps {
  readonly actions: SecurityProfileActions;
  readonly profile: SecurityProfile;
  readonly profileLimitReached?: boolean;
}

const SecurityProfileListContextualMenu: FC<
  SecurityProfileListContextualMenuProps
> = ({ actions, profile, profileLimitReached }) => {
  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="switcher-environments" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View "${profile.title}" security profile details`,
      hasIcon: true,
      onClick: actions.viewDetails,
    },
    {
      children: (
        <>
          <Icon name="file-blank" />
          <span>Download audit</span>
        </>
      ),
      "aria-label": `Download "${profile.title}" security profile audit`,
      hasIcon: true,
      onClick: actions.downloadAudit,
    },

    ...(profile.status !== "archived"
      ? [
          {
            children: (
              <>
                <Icon name="edit" />
                <span>Edit</span>
              </>
            ),
            "aria-label": `Edit "${profile.title}" security profile`,
            hasIcon: true,
            onClick: actions.edit,
          },
          {
            children: (
              <>
                <Icon name="play" />
                <span>Run</span>
              </>
            ),
            "aria-label": `Run "${profile.title}" security profile`,
            hasIcon: true,
            onClick: actions.run,
          },
        ]
      : []),

    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </>
      ),
      "aria-label": `Duplicate "${profile.title}" security profile`,
      hasIcon: true,
      onClick: actions.duplicate,
      disabled: profileLimitReached,
    },

    ...(profile.status !== "archived"
      ? [
          {
            children: (
              <>
                <Icon name="archive--negative" />
                <span className={classes.colorNegative}>Archive</span>
              </>
            ),
            "aria-label": `Archive "${profile.title}" security profile`,
            hasIcon: true,
            onClick: actions.archive,
            className: classes.archive,
          },
        ]
      : []),
  ];

  return (
    <>
      <ContextualMenu
        position="right"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${profile.title} profile actions` }}
        links={contextualMenuButtons}
      />
    </>
  );
};

export default SecurityProfileListContextualMenu;
