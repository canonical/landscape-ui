import { type FC, type Key, type ReactNode } from "react";
import classes from "./Blocks.module.scss";

interface Block {
  content: ReactNode;
  key: Key;
  title?: string;
}

interface BlocksProps {
  readonly children: Block[];
}

const Blocks: FC<BlocksProps> = ({ children }) => (
  <div className={classes.blocks}>
    {children.map(({ content, key, title }, index) => {
      const isTitleDefined = title !== undefined;

      return (
        <section key={key}>
          {(isTitleDefined || index > 0) && <hr className={classes.rule} />}
          {isTitleDefined && <h5 className={classes.heading}>{title}</h5>}
          {content}
        </section>
      );
    })}
  </div>
);

export default Blocks;
