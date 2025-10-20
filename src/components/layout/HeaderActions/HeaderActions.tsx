import ActionsMenu from "@/components/layout/ActionsMenu";
import type { Action } from "@/types/Action";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type Ref,
} from "react";
import classes from "./HeaderActions.module.scss";
import {
  actionListsAreEqual,
  bucketsHaveAnyCollapsed,
  collapsedBucketsAreEqual,
  combineActions,
  countExplicitCollapseFlags,
  filterOutExcludedActions,
  measureAndPartitionActionsByOverflow,
} from "./helpers";

export interface HeaderActionsProps {
  readonly actions: {
    destructive?: Action[];
    nondestructive?: Action[];
  };
  readonly title?: ReactNode;
}

const HeaderActions: FC<HeaderActionsProps> = ({
  actions: {
    destructive: destructiveFromProps = [],
    nondestructive: nondestructiveFromProps = [],
  },
  title,
}) => {
  const nondestructiveActions = useMemo(
    () => filterOutExcludedActions(nondestructiveFromProps),
    [nondestructiveFromProps],
  );
  const destructiveActions = useMemo(
    () => filterOutExcludedActions(destructiveFromProps),
    [destructiveFromProps],
  );

  const initialVisibleActions = useMemo(
    () => combineActions(nondestructiveActions, destructiveActions),
    [nondestructiveActions, destructiveActions],
  );

  const [visibleActions, setVisibleActions] = useState<Action[]>(
    initialVisibleActions,
  );
  const [collapsedActions, setCollapsedActions] = useState<{
    destructive: Action[];
    nondestructive: Action[];
  }>({
    nondestructive: [],
    destructive: [],
  });
  const [isCollapsedButtonVisible, setIsCollapsedButtonVisible] =
    useState<boolean>(false);

  const [previousContainerWidth, setPreviousContainerWidth] =
    useState<number>(0);

  const hasMultipleForcedCollapsed = useMemo(
    () =>
      countExplicitCollapseFlags(nondestructiveActions, destructiveActions) > 1,
    [nondestructiveActions, destructiveActions],
  );

  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const relayoutInProgressRef = useRef<boolean>(false);

  const recomputeLayoutFromMeasurements = useCallback(
    (renderedListEl: HTMLElement): void => {
      const { visible, collapsed, showCollapsedMenu } =
        measureAndPartitionActionsByOverflow(
          renderedListEl,
          nondestructiveActions,
          destructiveActions,
          hasMultipleForcedCollapsed,
        );

      setIsCollapsedButtonVisible((prev) =>
        prev === showCollapsedMenu ? prev : showCollapsedMenu,
      );

      setVisibleActions((prev) =>
        actionListsAreEqual(prev, visible) ? prev : visible,
      );
      setCollapsedActions((prev) =>
        collapsedBucketsAreEqual(prev, collapsed) ? prev : collapsed,
      );
    },
    [nondestructiveActions, destructiveActions, hasMultipleForcedCollapsed],
  );

  const handleContainerResize = useCallback(
    (containerEl: HTMLElement, listEl: HTMLElement): void => {
      const { width } = containerEl.getBoundingClientRect();

      if (width === previousContainerWidth) {
        return;
      }

      const grew = width > previousContainerWidth;
      setPreviousContainerWidth(width);

      const anyCollapsedNow = bucketsHaveAnyCollapsed(collapsedActions);

      if (grew && anyCollapsedNow && !relayoutInProgressRef.current) {
        relayoutInProgressRef.current = true;

        setIsCollapsedButtonVisible(false);

        const allActions = combineActions(
          nondestructiveActions,
          destructiveActions,
        );
        setVisibleActions(allActions);
        setCollapsedActions({ nondestructive: [], destructive: [] });

        return;
      }
      recomputeLayoutFromMeasurements(listEl);
    },
    [
      previousContainerWidth,
      collapsedActions,
      nondestructiveActions,
      destructiveActions,
      recomputeLayoutFromMeasurements,
    ],
  );

  const attachVisibleListAndObserve: Ref<HTMLElement> = useCallback(
    (listElement: HTMLElement | null) => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      if (!listElement) {
        return;
      }

      const listEl = listElement as HTMLDivElement;
      const containerEl = listEl.parentElement
        ?.parentElement as HTMLElement | null;

      if (!containerEl) {
        return;
      }

      recomputeLayoutFromMeasurements(listEl);
      relayoutInProgressRef.current = false;

      const resizeObserver = new ResizeObserver(() => {
        handleContainerResize(containerEl, listEl);
      });

      resizeObserver.observe(containerEl);
      resizeObserverRef.current = resizeObserver;
    },
    [recomputeLayoutFromMeasurements, handleContainerResize],
  );

  return (
    <div
      className={classNames(classes.titleRow, {
        [classes.wrapped]: !visibleActions.length,
      })}
    >
      {title}
      <div
        className={classNames(classes.container, {
          [classes.wrapped]: !visibleActions.length,
        })}
      >
        <div
          className={classNames(classes.innerContainer, "p-segmented-control")}
        >
          <div
            ref={attachVisibleListAndObserve}
            className="p-segmented-control__list"
          >
            {visibleActions.map(
              ({ collapsed: _c, excluded: _e, icon, label, ...action }) => (
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
    </div>
  );
};

export default HeaderActions;
