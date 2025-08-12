import type { ComponentProps, FC } from "react";
import InfoItem from "../../InfoItem";
import classes from "./Item.module.scss";

export type ItemProps = ComponentProps<typeof InfoItem> & {
  readonly large?: boolean;
};

const Item: FC<ItemProps> = ({ large, ...props }) => (
  <InfoItem className={large ? classes.largeItem : undefined} {...props} />
);

export default Item;
