import { type FC, type ReactNode } from "react";
import classes from "./Blocks.module.scss";

interface Block {
  content: ReactNode;
  title?: string;
}

interface BlocksProps {
  readonly children: Block[];
}

const Blocks: FC<BlocksProps> = ({ children }) => (
  <div className={classes.blocks}>
    {children.flatMap(({ content, title }, index) => {
      const isTitleDefined = title !== undefined;

      return (
        <section>
          {(isTitleDefined || index > 0) && <hr className={classes.rule} />}
          {isTitleDefined && <h5 className={classes.heading}>{title}</h5>}
          {content}
        </section>
      );
    })}
  </div>
);

export default Blocks;
