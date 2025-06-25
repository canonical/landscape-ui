import ActionsMenu from "@/components/layout/ActionsMenu";
import type { Action } from "@/types/Action";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { Ref } from "react";
import { useState, type FC } from "react";
import classes from "./HeaderActions.module.scss";

export interface HeaderActionsProps {
  readonly actions: {
    destructive?: Action[];
    nondestructive?: Action[];
  };
}

const HeaderActions: FC<HeaderActionsProps> = ({
  actions: {
    destructive: destructiveActions = [],
    nondestructive: nondestructiveActions = [],
  },
}) => {
  destructiveActions = destructiveActions.filter((action) => !action.excluded);

  nondestructiveActions = nondestructiveActions.filter(
    (action) => !action.excluded,
  );

  const initialVisibleActions = [
    ...nondestructiveActions,
    ...destructiveActions,
  ];

  const initialCollapsedActions = {
    nondestructive: [],
    destructive: [],
  };

  const [visibleActions, setVisibleActions] = useState(initialVisibleActions);

  const [collapsedActions, setCollapsedActions] = useState<{
    destructive: Action[];
    nondestructive: Action[];
  }>(initialCollapsedActions);

  const [isCollapsedButtonVisible, setIsCollapsedButtonVisible] =
    useState(false);

  const [previousWidth, setPreviousWidth] = useState(0);

  const visibleCheck = (element: HTMLElement, parentElement: HTMLElement) => {
    if (
      collapsedActions.destructive.length ||
      collapsedActions.nondestructive.length
    ) {
      return;
    }

    if (
      (!element.lastElementChild ||
        element.lastElementChild.getBoundingClientRect().right <=
          parentElement.getBoundingClientRect().right) &&
      nondestructiveActions.every((action) => !action.collapsed) &&
      destructiveActions.every((action) => !action.collapsed)
    ) {
      setIsCollapsedButtonVisible(false);
      return;
    }

    setIsCollapsedButtonVisible(true);

    const newVisibleActions: Action[] = [];
    const newCollapsedActions: {
      destructive: Action[];
      nondestructive: Action[];
    } = { nondestructive: [], destructive: [] };

    nondestructiveActions.forEach((action, index) => {
      if (
        element.children[index].getBoundingClientRect().right >
          element.getBoundingClientRect().right ||
        action.collapsed
      ) {
        newCollapsedActions.nondestructive.push(action);
      } else {
        newVisibleActions.push(action);
      }
    });

    destructiveActions.forEach((action, index) => {
      index += nondestructiveActions.length;

      if (
        element.children[index].getBoundingClientRect().right >
          element.getBoundingClientRect().right ||
        action.collapsed
      ) {
        newCollapsedActions.destructive.push(action);
      } else {
        newVisibleActions.push(action);
      }
    });

    setVisibleActions(newVisibleActions);
    setCollapsedActions(newCollapsedActions);
  };

  const initialVisibleCheck: Ref<HTMLElement> = (element) => {
    const parentElement = element?.parentElement?.parentElement;

    if (!parentElement) {
      return;
    }

    visibleCheck(element, parentElement);

    const observer = new ResizeObserver(() => {
      const { width } = parentElement.getBoundingClientRect();

      if (width !== previousWidth) {
        setVisibleActions(initialVisibleActions);
        setCollapsedActions(initialCollapsedActions);
        setPreviousWidth(width);
      }
    });

    observer.observe(parentElement);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <div className={classes.container}>
      <div
        className={classNames(classes.innerContainer, "p-segmented-control")}
      >
        <div ref={initialVisibleCheck} className="p-segmented-control__list">
          {visibleActions.map(
            ({
              collapsed: _collapsed,
              excluded: _excluded,
              icon,
              label,
              ...action
            }) => (
              <Button
                className={classNames(
                  classes.button,
                  "u-no-margin--bottom p-segmented-control__button",
                )}
                key={label}
                {...action}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </Button>
            ),
          )}
        </div>
      </div>

      {isCollapsedButtonVisible && (
        <ActionsMenu
          hasToggleIcon
          toggleLabel={visibleActions.length ? "More actions" : "Actions"}
          toggleClassName="u-no-margin--bottom"
          toggleDisabled={[
            ...destructiveActions,
            ...nondestructiveActions,
          ].every((action) => action.disabled)}
          actions={collapsedActions.nondestructive}
          destructiveActions={collapsedActions.destructive}
        />
      )}
    </div>
  );
};

export default HeaderActions;
