import { type FC } from "react";
import { pluralize } from "@/utils/_helpers";

interface SnapItemSubtitleProps {
  readonly scope: string;
  readonly computerCount: number;
  readonly instancesCount: number;
}

const SnapItemSubtitle: FC<SnapItemSubtitleProps> = ({
  scope,
  computerCount,
  instancesCount,
}) => {
  return (
    <span className="u-text--muted">
      {scope} on {computerCount} of{" "}
      {pluralize(instancesCount, ["instance"], "exact")}
    </span>
  );
};

export default SnapItemSubtitle;
