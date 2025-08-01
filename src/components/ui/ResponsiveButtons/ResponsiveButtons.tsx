import type { FC, ReactElement, ReactNode } from "react";
import { isValidElement, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";
import type {
  ConfirmationButtonProps,
  MenuLink,
  Position,
} from "@canonical/react-components";
import { ContextualMenu } from "@canonical/react-components";
import { BREAKPOINT_PX } from "@/constants";
import classes from "./ResponsiveButtons.module.scss";
import type { ButtonLikeProps } from "./types";
import {
  decorateNode,
  textFromNode,
} from "@/components/ui/ResponsiveButtons/helpers";

export interface ResponsiveButtonGroupProps {
  readonly buttons: ReactNode[];
  readonly collapseFrom?: keyof typeof BREAKPOINT_PX;
  readonly alwaysVisible?: number;
  readonly menuLabel?: string;
  readonly className?: string;
  readonly menuPosition?: Position;
  readonly grouped?: boolean;
}

const ResponsiveButtons: FC<ResponsiveButtonGroupProps> = ({
  buttons,
  collapseFrom = "md",
  alwaysVisible = 0,
  menuLabel = "Actions",
  className,
  menuPosition = "right",
  grouped = true,
}) => {
  const isLargeScreen = useMediaQuery(
    `(min-width: ${BREAKPOINT_PX[collapseFrom]}px)`,
  );

  const { visibleButtons, collapsedLinks } = useMemo(() => {
    const visible = isLargeScreen ? buttons : buttons.slice(0, alwaysVisible);
    const collapsed: (MenuLink & { key: string })[] = [];

    buttons.slice(isLargeScreen ? 0 : alwaysVisible).forEach((node, i) => {
      const index = isLargeScreen ? i : i + alwaysVisible;

      if (
        isValidElement(node) &&
        ((node.props as ButtonLikeProps).onClick ||
          (node.props as ConfirmationButtonProps).confirmationModalProps) &&
        !visible.includes(node)
      ) {
        const el = node as ReactElement<ButtonLikeProps>;

        collapsed.push({
          key: `action-${index}`,
          children: textFromNode(el) || `Action ${index + 1}`,
          onClick: el.props.onClick,
          disabled: el.props.disabled,
        });

        return;
      }

      if (!visible.includes(node)) {
        visible.push(node);
      }
    });

    return { visibleButtons: visible, collapsedLinks: collapsed };
  }, [buttons, alwaysVisible, isLargeScreen]);
  console.log(visibleButtons, collapsedLinks);
  const groupedMarkup =
    grouped && visibleButtons.length > 1 ? (
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          {visibleButtons.map(
            (node, i): ReactNode =>
              decorateNode(
                node,
                i,
                "p-segmented-control__button u-no-margin--bottom",
              ),
          )}
        </div>
      </div>
    ) : (
      <>
        {visibleButtons.map(
          (node, i): ReactNode => decorateNode(node, i, "u-no-margin--bottom"),
        )}
      </>
    );

  return (
    <div
      className={classNames(className, {
        [classes.grouped]: grouped,
      })}
    >
      {visibleButtons.length > 0 && groupedMarkup}

      {collapsedLinks.length > 0 && (
        <ContextualMenu
          position={menuPosition}
          hasToggleIcon
          toggleLabel={menuLabel}
          toggleClassName="u-no-margin--bottom"
          toggleDisabled={collapsedLinks.every(
            (link) => "disabled" in link && link.disabled,
          )}
          links={collapsedLinks}
        />
      )}
    </div>
  );
};

export default ResponsiveButtons;
