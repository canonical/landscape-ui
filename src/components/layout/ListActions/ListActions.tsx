import type { ButtonProps } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import classes from "./ListActions.module.scss";

type ListAction = Omit<ButtonProps, "children" | "hasIcon"> & {
  icon: string;
  label: string;
};

type ListActionsProps = Omit<
  ComponentProps<typeof ContextualMenu<null>>,
  "links" | "toggle"
> & {
  readonly toggleAriaLabel: string;
  readonly actions?: ListAction[];
  readonly destructiveActions?: ListAction[];
};

const ListActions: FC<ListActionsProps> = ({
  actions = [],
  className,
  destructiveActions = [],
  toggleAriaLabel,
  toggleClassName,
  toggleProps,
  ...props
}) => {
  const nondestructiveLinks = actions.map((action) => ({
    ...action,
    children: (
      <>
        <Icon name={action.icon} />
        <span>{action.label}</span>
      </>
    ),
  }));

  const destructiveLinks = destructiveActions.map((action, i) => ({
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
      toggleClassName={classNames(classes.toggleButton, toggleClassName)}
      toggleAppearance="base"
      toggleLabel={<Icon name="contextual-menu" />}
      toggleProps={{
        "aria-label": toggleAriaLabel,
        ...toggleProps,
      }}
      links={links}
      {...props}
    />
  );
};

export default ListActions;
