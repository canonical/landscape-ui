import type { FilterProps } from "@/components/filter/types";
import { Button, Icon } from "@canonical/react-components";
import type { FC, ReactElement } from "react";
import { cloneElement, useRef } from "react";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import classes from "./ResponsiveTableFilterItem.module.scss";

interface ResponsiveTableFilterItemProps {
  readonly el: ReactElement<FilterProps>;
}

const ResponsiveTableFilterItem: FC<ResponsiveTableFilterItemProps> = ({
  el,
}) => {
  const { value: isOpen, setFalse: close, toggle } = useBoolean();
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, close);

  const cloned = cloneElement(el, {
    inline: true,
  });

  return (
    <div ref={ref} className={classes.root}>
      <Button
        type="button"
        appearance="base"
        className={classes.label}
        onClick={toggle}
      >
        <Icon name="chevron-down" className={classes.icon} />
        <span className={classes.text}>{el.props.label}</span>
      </Button>
      {isOpen && (
        <div className={`p-contextual-menu__dropdown ${classes.content}`}>
          {cloned}
        </div>
      )}
    </div>
  );
};

export default ResponsiveTableFilterItem;
