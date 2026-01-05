import type { Action } from "@/types/Action";

export const filterOutExcludedActions = (actions: Action[]): Action[] =>
  actions.filter((a) => !a.excluded);

export const combineActions = (
  nondestructive: Action[],
  destructive: Action[],
): Action[] => [...nondestructive, ...destructive];

const actionsHaveSameIdentity = (left: Action, right: Action): boolean =>
  left.label === right.label &&
  left.icon === right.icon &&
  Boolean(left.disabled) === Boolean(right.disabled);

export const actionListsAreEqual = (
  leftList: Action[],
  rightList: Action[],
): boolean => {
  if (leftList.length !== rightList.length) {
    return false;
  }

  return leftList.every((leftAction, index) => {
    const rightAction = rightList[index];

    if (rightAction === undefined) {
      return false;
    }

    return actionsHaveSameIdentity(leftAction, rightAction);
  });
};

export const bucketsHaveAnyCollapsed = (bucket: {
  destructive: Action[];
  nondestructive: Action[];
}): boolean => bucket.destructive.length + bucket.nondestructive.length > 0;

export const collapsedBucketsAreEqual = (
  a: { destructive: Action[]; nondestructive: Action[] },
  b: { destructive: Action[]; nondestructive: Action[] },
): boolean =>
  actionListsAreEqual(a.destructive, b.destructive) &&
  actionListsAreEqual(a.nondestructive, b.nondestructive);

export const countExplicitCollapseFlags = (
  nondestructiveActions: Action[],
  destructiveActions: Action[],
): number => {
  const countFlags = (actions: Action[]) =>
    actions.filter((action) => action.collapsed).length;
  return countFlags(nondestructiveActions) + countFlags(destructiveActions);
};

export const measureAndPartitionActionsByOverflow = (
  listEl: HTMLElement,
  nondestructive: Action[],
  destructive: Action[],
  hasMultipleForcedCollapsed: boolean,
): {
  visible: Action[];
  collapsed: { nondestructive: Action[]; destructive: Action[] };
  showCollapsedMenu: boolean;
} => {
  const listRightBoundary = listEl.getBoundingClientRect().right;
  const visible: Action[] = [];
  const collapsed = {
    nondestructive: [] as Action[],
    destructive: [] as Action[],
  };
  nondestructive.forEach((action, i) => {
    const childEl = listEl.children[i] as HTMLElement;
    let overflows = false;
    const forced = action.collapsed && hasMultipleForcedCollapsed;
    let childRight = 0;

    if (!childEl) {
      overflows = true;
    } else {
      childRight = childEl.getBoundingClientRect().right;
      overflows = childRight > listRightBoundary + 1;
    }

    if (overflows || forced) {
      collapsed.nondestructive.push(action);
    } else {
      visible.push(action);
    }
  });

  destructive.forEach((action, i) => {
    const index = nondestructive.length + i;
    const childEl = listEl.children[index] as HTMLElement;
    let overflows = false;
    const forced = action.collapsed && hasMultipleForcedCollapsed;
    let childRight = 0;

    if (!childEl) {
      overflows = true;
    } else {
      childRight = childEl.getBoundingClientRect().right;
      overflows = childRight > listRightBoundary + 1;
    }

    if (overflows || forced) {
      collapsed.destructive.push(action);
    } else {
      visible.push(action);
    }
  });

  const showCollapsedMenu =
    bucketsHaveAnyCollapsed(collapsed) || hasMultipleForcedCollapsed;

  return { visible, collapsed, showCollapsedMenu };
};
