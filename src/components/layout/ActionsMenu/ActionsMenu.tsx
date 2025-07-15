import type { Action } from "@/types/Action";
import { ContextualMenu, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import classes from "./ActionsMenu.module.scss";

type ActionsMenuProps = Omit<
  ComponentProps<typeof ContextualMenu<null>>,
  "links" | "toggle"
> & {
  readonly toggleAriaLabel?: string;
  readonly actions?: Action[];
  readonly destructiveActions?: Action[];
};

const ActionsMenu: FC<ActionsMenuProps> = ({
  actions = [],
  className,
  destructiveActions = [],
  toggleAriaLabel,
  toggleProps,
  ...props
}) => {
  const nondestructiveLinks = actions
    .filter((action) => !action.excluded)
    .map((action) => ({
      ...action,
      children: (
        <>
          <Icon name={action.icon} />
          <span>{action.label}</span>
        </>
      ),
    }));

  const destructiveLinks = destructiveActions
    .filter((action) => !action.excluded)
    .map((action, i) => ({
      ...action,
      children: (
        <>
          <Icon name={`${action.icon}--negative`} />
          <span className="u-text--negative">{action.label}</span>
        </>
      ),
      className:
        nondestructiveLinks.length && i === 0 ? classes.separator : undefined,
    }));

  const links = [...nondestructiveLinks, ...destructiveLinks].map((link) => ({
    ...link,
    hasIcon: true,
  }));

  return (
    <ContextualMenu
      className={classNames(classes.menu, className)}
      toggleProps={{
        "aria-label": toggleAriaLabel,
        ...toggleProps,
      }}
      links={links}
      {...props}
    />
  );
};

export default ActionsMenu;
