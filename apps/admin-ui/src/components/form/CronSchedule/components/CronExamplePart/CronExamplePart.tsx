import type { FC, ReactNode } from "react";

interface ExamplePartProps {
  readonly label: ReactNode;
  readonly value: ReactNode;
}

const CronExamplePart: FC<ExamplePartProps> = ({ label, value }) => {
  return (
    <div>
      <div className="p-heading--1 u-no-padding--top u-no-margin--bottom">
        {value}
      </div>

      <div className="p-text--x-small u-text--muted">{label}</div>
    </div>
  );
};

export default CronExamplePart;
