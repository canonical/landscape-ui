import {
  decorateNode,
  getContextualMenuProps,
  isContextualMenu,
  textFromNode,
} from "@/components/ui/ResponsiveButtons/helpers";
import { BREAKPOINT_PX } from "@/constants";
import type {
  ConfirmationButtonProps,
  Position,
} from "@canonical/react-components";
import { Button, ContextualMenu } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactElement, ReactNode } from "react";
import { isValidElement, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import ResponsiveDropdownItem from "@/components/ui/ResponsiveDropdownItem";
import classes from "./ResponsiveButtons.module.scss";
import type { ButtonLikeProps, CollapsedLink, CollapsedNode } from "./types";

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

  const { visibleButtons, collapsedItems } = useMemo(() => {
    const visible = isLargeScreen ? buttons : buttons.slice(0, alwaysVisible);

    const collapsed: (CollapsedLink | CollapsedNode)[] = [];

    buttons.slice(isLargeScreen ? 0 : alwaysVisible).forEach((node, i) => {
      const index = isLargeScreen ? i : i + alwaysVisible;

      if (isContextualMenu(node) && !visible.includes(node)) {
        const menuProps = getContextualMenuProps(node);
        if (menuProps) {
          const content = (
            <>
              {menuProps.links?.map((link, linkIndex) => {
                if (typeof link === "string" || Array.isArray(link)) {
                  return null;
                }
                return (
                  <Button
                    key={linkIndex}
                    type="button"
                    className="p-contextual-menu__link"
                    onClick={(e) => {
                      if (link.onClick) {
                        link.onClick(e);
                      }
                    }}
                    disabled={link.disabled}
                  >
                    {link.children}
                  </Button>
                );
              })}
            </>
          );

          collapsed.push({
            key: `contextual-menu-${index}`,
            label: menuProps.toggleLabel,
            content,
            disabled: menuProps.toggleDisabled,
          });
        }
        return;
      }

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

    return { visibleButtons: visible, collapsedItems: collapsed };
  }, [buttons, alwaysVisible, isLargeScreen]);

  const groupedMarkup =
    grouped && visibleButtons.length > 1 ? (
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          {visibleButtons.map((node, i): ReactNode => {
            if (isContextualMenu(node)) {
              return decorateNode(node, i, "u-no-margin--bottom");
            }

            return decorateNode(
              node,
              i,
              "p-segmented-control__button u-no-margin--bottom",
            );
          })}
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

      {collapsedItems.length > 0 && (
        <ContextualMenu
          position={menuPosition}
          hasToggleIcon
          toggleLabel={menuLabel}
          toggleClassName="u-no-margin--bottom"
        >
          {(close: () => void) => (
            <>
              {collapsedItems.map((item) => {
                if ("content" in item && "label" in item) {
                  return (
                    <ResponsiveDropdownItem
                      key={item.key}
                      el={item.content}
                      label={item.label}
                      disabled={item.disabled}
                      onMenuClose={close}
                    />
                  );
                }
                if (typeof item !== "string" && "onClick" in item) {
                  return (
                    <Button
                      key={item.key}
                      type="button"
                      className="p-contextual-menu__link"
                      onClick={(e) => {
                        close();
                        if (item.onClick) {
                          item.onClick(e);
                        }
                      }}
                      disabled={item.disabled}
                    >
                      {item.children}
                    </Button>
                  );
                }
                return null;
              })}
            </>
          )}
        </ContextualMenu>
      )}
    </div>
  );
};

export default ResponsiveButtons;
