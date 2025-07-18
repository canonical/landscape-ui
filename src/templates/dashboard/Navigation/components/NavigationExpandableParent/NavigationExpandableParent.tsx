import type { FC } from "react";
import classNames from "classnames";
import classes from "../../Navigation.module.scss";
import type { MenuItem } from "@/templates/dashboard/Navigation/types";
import { Button } from "@canonical/react-components";

interface NavigationExpandableParentProps {
  readonly item: MenuItem;
  readonly expanded: string;
  readonly onClick: () => void;
}

const NavigationExpandableParent: FC<NavigationExpandableParentProps> = ({
  item,
  expanded,
  onClick,
}) => {
  return (
    <Button
      className={classNames(
        "p-side-navigation__accordion-button",
        classes.accordionButton,
      )}
      type="button"
      aria-expanded={expanded === item.path}
      onClick={onClick}
    >
      {item.icon && (
        <i
          className={classNames(
            `p-icon--${item.icon} is-light p-side-navigation__icon`,
            classes.icon,
          )}
        />
      )}
      <span className={classNames("p-side-navigation__label", classes.label)}>
        {item.label}
      </span>
    </Button>
  );
};

export default NavigationExpandableParent;
