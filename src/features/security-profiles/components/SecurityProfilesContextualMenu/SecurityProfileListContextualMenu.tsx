import type { FC } from "react";
import type { SecurityProfile } from "../../types";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import classes from "./SecurityProfileListContextualMenu.module.scss";

interface SecurityProfileListContextualMenuProps {
  readonly profile: SecurityProfile;
}

const SecurityProfileListContextualMenu: FC<
  SecurityProfileListContextualMenuProps
> = ({ profile }) => {
  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="switcher-environments" />
          <span>View details</span>
        </>
      ),
      "aria-label": `Edit "${profile.title}" profile`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="begin-downloading" />
          <span>Download audit</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" repository profile`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" repository profile`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="play" />
          <span>Run</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" repository profile`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" repository profile`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="archive-red" />
          <span className={classes.colorNegative}>Archive</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" repository profile`,
      hasIcon: true,
    },
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
