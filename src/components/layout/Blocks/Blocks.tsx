import { type FC, type ReactNode } from "react";
import classes from "./Blocks.module.scss";

interface Block {
  content: ReactNode;
  title?: string;
}

interface BlocksProps {
  readonly items: Block[];
}

const Blocks: FC<BlocksProps> = ({ items }) => (
  <div className={classes.blocks}>
    {items.map(({ content, title }, index) => {
      const isTitleDefined = title !== undefined;

      return (
        <section key={index}>
          {(isTitleDefined || index > 0) && <hr className={classes.rule} />}
          {isTitleDefined && <h5 className={classes.heading}>{title}</h5>}
          {content}
        </section>
      );
    })}
  </div>
);

export default Blocks;
