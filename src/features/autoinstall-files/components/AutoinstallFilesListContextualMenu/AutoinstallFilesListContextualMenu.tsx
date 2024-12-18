import { FC } from "react";
import { ContextualMenu, Icon, MenuLink } from "@canonical/react-components";
import { AutoinstallFile } from "../../types";
import classes from "./AutoinstallFilesListContextualMenu.module.scss";

interface AutoinstallFilesListContextualMenuProps {
  file: AutoinstallFile;
}

const AutoinstallFilesListContextualMenu: FC<
  AutoinstallFilesListContextualMenuProps
> = ({ file }) => {
  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="topic" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View ${file.title} details`,
      hasIcon: true,
      onClick: undefined,
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${file.title}`,
      hasIcon: true,
      onClick: undefined,
    },
    {
      children: (
        <>
          <Icon name="starred" />
          <span>Set as default</span>
        </>
      ),
      "aria-label": `Set ${file.title} as default`,
      hasIcon: true,
      onClick: undefined,
    },
    {
      children: (
        <>
          <Icon name="delete" />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove ${file.title}`,
      hasIcon: true,
      onClick: undefined,
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
        toggleProps={{ "aria-label": `${file.title} profile actions` }}
        links={contextualMenuButtons}
      />
    </>
  );
};

export default AutoinstallFilesListContextualMenu;
