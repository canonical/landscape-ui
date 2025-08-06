import type { ComponentProps, FC } from "react";
import InfoItem from "../InfoItem";

export type ItemProps = ComponentProps<typeof InfoItem> & {
  readonly size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

const Item: FC<ItemProps> = ({ size, ...props }) => (
  <InfoItem style={{ gridColumn: `span ${size}` }} {...props} />
);

export default Item;
