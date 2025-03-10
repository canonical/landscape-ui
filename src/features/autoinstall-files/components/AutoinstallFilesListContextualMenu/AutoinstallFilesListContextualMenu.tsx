import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFile, WithGroups } from "../../types";

interface AutoinstallFilesListContextualMenuProps {
  readonly edit: (file: AutoinstallFile) => void;
  readonly file: WithGroups<AutoinstallFile>;
  readonly remove: (file: AutoinstallFile) => void;
  readonly setAsDefault: (file: AutoinstallFile) => void;
  readonly viewDetails: (file: WithGroups<AutoinstallFile>) => void;
}

const AutoinstallFilesListContextualMenu: FC<
  AutoinstallFilesListContextualMenuProps
> = ({ edit, file, remove, setAsDefault, viewDetails }) => {
  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="topic" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View ${file.filename} details`,
      hasIcon: true,
      onClick: (): void => {
        viewDetails(file);
      },
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${file.filename}`,
      hasIcon: true,
      onClick: (): void => {
        edit(file);
      },
    },
    {
      children: (
        <>
          <Icon name="starred" />
          <span>Set as default</span>
        </>
      ),
      "aria-label": `Set ${file.filename} as default`,
      hasIcon: true,
      onClick: (): void => {
        setAsDefault(file);
      },
      disabled: file.is_default,
    },
    {
      children: (
        <>
          <Icon name="delete" />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove ${file.filename}`,
      hasIcon: true,
      onClick: (): void => {
        remove(file);
      },
      disabled: file.is_default,
    },
  ];

  return (
    <>
      <ContextualMenu
        position="left"
        toggleClassName="u-no-margin u-no-padding"
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${file.filename} actions` }}
        links={contextualMenuButtons}
      />
    </>
  );
};

export default AutoinstallFilesListContextualMenu;
