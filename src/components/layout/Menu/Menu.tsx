import { Col, Row } from "@canonical/react-components";
import type { ComponentProps, FC } from "react";
import InfoItem from "../InfoItem";

type Item = ComponentProps<typeof InfoItem> &
  Pick<ComponentProps<typeof Col>, "size">;

interface MenuProps {
  items: Item[];
}

const Menu: FC<MenuProps> = ({ items }) =>
  items
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
      <Row key={rowIndex} className="u-no-padding u-no-max-width">
        {columns.map(({ size, ...props }, columnIndex) => (
          <Col key={columnIndex} size={size}>
            <InfoItem {...props} />
          </Col>
        ))}
      </Row>
    ));

export default Menu;
