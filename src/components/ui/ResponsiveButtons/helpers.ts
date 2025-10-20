import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";
import type { ButtonLikeProps, ContextualMenuProps } from "./types";
import classNames from "classnames";

export const textFromNode = (node: ReactNode): string => {
  const collect = (n: ReactNode): string[] => {
    if (typeof n === "string") {
      return [n];
    }

    if (Array.isArray(n)) {
      return n.flatMap(collect);
    }

    if (isValidElement(n)) {
      return collect((n as ReactElement<ButtonLikeProps>).props.children);
    }

    return [];
  };

  return collect(node).join(" ").trim();
};

export const decorateNode = (
  node: ReactNode,
  i: number,
  extraClasses?: string,
): ReactNode => {
  if (isValidElement(node)) {
    const el = node as ReactElement<ButtonLikeProps>;
    return cloneElement(el, {
      key: el.key ?? i,
      className: classNames(extraClasses, el.props.className),
    });
  }

  return node;
};

export const isContextualMenu = (node: ReactNode): boolean => {
  if (!isValidElement(node)) {
    return false;
  }
  const displayName =
    (node.type as { displayName?: string })?.displayName ||
    (node.type as { name?: string })?.name ||
    "";
  return displayName.includes("ContextualMenu");
};

export const getContextualMenuProps = (
  node: ReactNode,
): ContextualMenuProps | null => {
  if (!isValidElement(node)) {
    return null;
  }
  return node.props as ContextualMenuProps;
};
