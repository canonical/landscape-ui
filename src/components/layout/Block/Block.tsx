import type { FC, ReactNode } from "react";
import classes from "./Block.module.scss";

interface BlockProps {
  readonly children: ReactNode;
  readonly heading?: ReactNode;
}

const Block: FC<BlockProps> = ({ children, heading }) => {
  return (
    <section className={classes.block}>
      {heading && <h5 className={classes.heading}>{heading}</h5>}

      {children}
    </section>
  );
};

export default Block;
