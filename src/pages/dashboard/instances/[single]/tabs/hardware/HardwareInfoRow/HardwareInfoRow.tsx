import Block from "@/components/layout/Block";
import Menu from "@/components/layout/Menu";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./HardwareInfoRow.module.scss";

interface InfoBlock {
  label: string;
  value: ReactNode;
}

interface HardwareInfoRowProps {
  readonly infoRowLabel: string;
  readonly infoBlocksArray: InfoBlock[][];
}

const HardwareInfoRow: FC<HardwareInfoRowProps> = ({
  infoRowLabel,
  infoBlocksArray,
}) => {
  return (
    <div
      className={classNames(
        "p-strip u-no-padding--bottom u-no-padding--top u-no-max-width",
        classes.wrapper,
      )}
    >
      <h3 className={classNames("p-heading--4", classes.blockTitle)}>
        {infoRowLabel}
      </h3>
      <div className={classes.infoRows}>
        {infoBlocksArray.map((infoBlocks, index) => (
          <Block heading={index > 0} key={index}>
            <Menu
              items={infoBlocks.map((infoBlock) => ({
                ...infoBlock,
                size: 3,
              }))}
            />
          </Block>
        ))}
      </div>
    </div>
  );
};

export default HardwareInfoRow;
