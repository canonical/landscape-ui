import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFile, AutoinstallFileWithGroups } from "../../types";
import classes from "./AutoinstallFilesListContextualMenu.module.scss";

interface AutoinstallFilesListContextualMenuProps {
  readonly file: AutoinstallFileWithGroups;
  readonly openDetailsPanel: (file: AutoinstallFileWithGroups) => void;
  readonly openEditPanel: (file: AutoinstallFileWithGroups) => void;
  readonly remove: (file: AutoinstallFile) => void;
}

const AutoinstallFilesListContextualMenu: FC<
  AutoinstallFilesListContextualMenuProps
> = ({ file, openDetailsPanel, openEditPanel, remove }) => {
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
      onClick: () => openDetailsPanel(file),
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
      onClick: () => openEditPanel(file),
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
      disabled: file.is_default,
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
      onClick: () => remove(file),
      disabled: file.is_default,
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
