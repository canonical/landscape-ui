import { BREAKPOINT_PX } from "@/constants";
import {
  ModularTable,
  type ModularTableProps,
} from "@canonical/react-components";
import classNames from "classnames";
import type { UIEventHandler } from "react";
import { useState, type JSX } from "react";
import { useMediaQuery } from "usehooks-ts";
import classes from "./ResponsiveTable.module.scss";

export interface ResponsiveTableProps<
  Row extends Record<string, unknown> = Record<string, unknown>,
> extends ModularTableProps<Row> {
  readonly minWidth?: number;
}

export default function ResponsiveTable<
  Row extends Record<string, unknown> = Record<string, unknown>,
>({
  style,
  minWidth = 1024,
  ...tableProps
}: ResponsiveTableProps<Row>): JSX.Element {
  const isSmall = useMediaQuery(`(max-width: ${BREAKPOINT_PX.sm}px)`);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  const className = classNames(classes.responsiveTable, {
    [classes.scrolledDown]: isScrolledDown,
  });

  const handleScroll: UIEventHandler = (event) => {
    setIsScrolledDown(event.currentTarget.scrollTop > 0);
    setIsScrolledRight(event.currentTarget.scrollLeft > 0);
  };

  const columns = isSmall
    ? tableProps.columns
    : [
        {
          ...tableProps.columns[0],
          className: classNames(
            tableProps.columns[0].className,
            classes.firstColumn,
            {
              [classes.scrolledRight]: isScrolledRight,
            },
          ),
        },
        ...tableProps.columns.slice(1),
      ];

  const getHeaderProps: ModularTableProps<Row>["getHeaderProps"] = (header) => {
    const headerProps = tableProps.getHeaderProps
      ? tableProps.getHeaderProps(header)
      : {};

    headerProps.className = classNames(headerProps.className, classes.firstRow);
    return headerProps;
  };

  return (
    <div className={className} onScroll={handleScroll} style={style}>
      <ModularTable
        {...tableProps}
        columns={columns}
        getHeaderProps={getHeaderProps}
        style={{ minWidth }}
      />
    </div>
  );
}
