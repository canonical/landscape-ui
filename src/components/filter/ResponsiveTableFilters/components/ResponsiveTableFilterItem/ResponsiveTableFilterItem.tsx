import classes from "./ResponsiveTableFilterItem.module.scss";
import type { FC, ReactElement } from "react";
import { cloneElement, useRef, useState } from "react";
import type { TableFilterProps } from "@/components/filter/TableFilter/types";
import { useOnClickOutside } from "usehooks-ts";
import { Button, Icon } from "@canonical/react-components";

interface ResponsiveTableFilterItemProps {
  readonly el: ReactElement<TableFilterProps>;
}

const ResponsiveTableFilterItem: FC<ResponsiveTableFilterItemProps> = ({
  el,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    if (open) {
      setOpen(false);
    }
  });

  const cloned = cloneElement(el, {
    inline: true,
  });

  return (
    <div ref={ref} className={classes.root}>
      <Button
        type="button"
        appearance="base"
        className={classes.label}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Icon name="chevron-down" className={classes.icon} />
        <span className={classes.text}>{el.props.label}</span>
      </Button>
      {open && (
        <div className={`p-contextual-menu__dropdown ${classes.content}`}>
          {cloned}
        </div>
      )}
    </div>
  );
};

export default ResponsiveTableFilterItem;
