import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";
import ActionsMenu from "../ActionsMenu";
import classes from "./ListActions.module.scss";

type ListActionsProps = ComponentProps<typeof ActionsMenu>;

const ListActions: FC<ListActionsProps> = ({ toggleClassName, ...props }) => {
  return (
    <ActionsMenu
      toggleClassName={classNames(classes.toggleButton, toggleClassName)}
      toggleAppearance="base"
      toggleLabel={<Icon name="contextual-menu" />}
      {...props}
    />
  );
};

export default ListActions;
