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

  const [previousWidths, setPreviousWidths] = useState({
    element: 0,
    buttonsElement: 0,
  });

  const visibleCheck = (element: HTMLElement, buttonsElement: HTMLElement) => {
    if (
      collapsedActions.destructive.length ||
      collapsedActions.nondestructive.length
    ) {
      return;
    }

    if (
      !element.lastElementChild ||
      element.lastElementChild.getBoundingClientRect().right <=
        buttonsElement.getBoundingClientRect().right
    ) {
      setIsCollapsedButtonVisible(false);
      return;
    }

    setIsCollapsedButtonVisible(true);

    const newVisibleActions = [];
    const newCollapsedActions: {
      destructive: Action[];
      nondestructive: Action[];
    } = { nondestructive: [], destructive: [] };

    for (const index in nondestructiveActions) {
      if (
        element.children[index].getBoundingClientRect().right >
        buttonsElement.getBoundingClientRect().right
      ) {
        newCollapsedActions.nondestructive.push(nondestructiveActions[index]);
      } else {
        newVisibleActions.push(nondestructiveActions[index]);
      }
    }

    for (const index in destructiveActions) {
      if (
        element.children[
          parseInt(index) + nondestructiveActions.length
        ].getBoundingClientRect().right >
        buttonsElement.getBoundingClientRect().right
      ) {
        newCollapsedActions.destructive.push(destructiveActions[index]);
      } else {
        newVisibleActions.push(destructiveActions[index]);
      }
    }

    setVisibleActions(newVisibleActions);
    setCollapsedActions(newCollapsedActions);
  };

  const initialVisibleCheck: Ref<HTMLElement> = (element) => {
    const buttonsElement = element?.parentElement;

    if (!buttonsElement) {
      return;
    }

    visibleCheck(element, buttonsElement);

    const observer = new ResizeObserver(() => {
      const elementWidth = element.getBoundingClientRect().width;
      const buttonsElementWidth = buttonsElement.getBoundingClientRect().width;

      if (
        elementWidth !== previousWidths.element ||
        buttonsElementWidth !== previousWidths.buttonsElement
      ) {
        setVisibleActions(initialVisibleActions);
        setCollapsedActions(initialCollapsedActions);
        setPreviousWidths({
          element: elementWidth,
          buttonsElement: buttonsElementWidth,
        });
      }
    });

    observer.observe(element);
    observer.observe(buttonsElement);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <div className={classes.container}>
      {!!visibleActions.length && (
        <div
          className={classNames(classes.innerContainer, "p-segmented-control")}
        >
          <div ref={initialVisibleCheck} className="p-segmented-control__list">
            {visibleActions.map(({ excluded: _, icon, label, ...action }) => (
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
            ))}
          </div>
        </div>
      )}

      {isCollapsedButtonVisible && (
        <ActionsMenu
          hasToggleIcon
          toggleLabel="More actions"
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
