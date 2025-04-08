import type { MenuLink } from "@canonical/react-components";
import {
  //ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import type { FC } from "react";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";
import classes from "./SecurityProfileListContextualMenu.module.scss";
//import LoadingState from "@/components/layout/LoadingState";
//import useSidePanel from "@/hooks/useSidePanel";
//import { useRepositoryProfiles } from "../../hooks";
//import useDebug from "@/hooks/useDebug";
//import { lazy, Suspense, useState } from "react";

interface SecurityProfileListContextualMenuProps {
  readonly actions: SecurityProfileActions;
  readonly profile: SecurityProfile;
}

const SecurityProfileListContextualMenu: FC<
  SecurityProfileListContextualMenuProps
> = ({ actions, profile }) => {
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
    },
    {
      children: (
        <>
          <Icon name="begin-downloading" />
          <span>Download audit</span>
        </>
      ),
      "aria-label": `Download "${profile.title}" security profile audit`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit "${profile.title}" security profile`,
      hasIcon: true,
      onClick: () => {
        actions.edit(profile);
      },
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
    },
    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </>
      ),
      "aria-label": `Duplicate "${profile.title}" security profile`,
      hasIcon: true,
      onClick: () => {
        actions.duplicate(profile);
      },
    },
    {
      children: (
        <>
          <Icon name="archive" />
          <span className={classes.red}>Archive</span>
        </>
      ),
      "aria-label": `Archive "${profile.title}" security profile`,
      hasIcon: true,
    },
  ];

  return (
    <>
      <ContextualMenu
        position="left"
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
