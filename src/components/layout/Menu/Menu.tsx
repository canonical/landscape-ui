import { Col, Row } from "@canonical/react-components";
import type { ComponentProps, FC } from "react";
import InfoItem from "../InfoItem";
import classes from "./Menu.module.scss";
import classNames from "classnames";

type Item = ComponentProps<typeof InfoItem> &
  Pick<ComponentProps<typeof Col>, "size">;

interface MenuProps {
  readonly items: Item[];
}

const Menu: FC<MenuProps> = ({ items }) => (
  <div className={classes.menu}>
    {items
      .reduce((rows: Item[][], item) => {
        const [lastRow, ...firstRows] = rows;

        if (
          lastRow &&
          lastRow.reduce((totalSize, { size }) => totalSize + size, 0) +
            item.size <=
            12
        ) {
          return [[...lastRow, item], ...firstRows];
        } else {
          return [[item], ...rows];
        }
      }, [])
      .toReversed()
      .map((columns, rowIndex) => (
        <Row
          key={rowIndex}
          className={classNames("u-no-padding u-no-max-width", classes.row)}
        >
          {columns.map(({ size, ...props }, columnIndex) => (
            <Col key={columnIndex} size={size}>
              <InfoItem {...props} />
            </Col>
          ))}
        </Row>
      ))}
  </div>
);

export default Menu;
