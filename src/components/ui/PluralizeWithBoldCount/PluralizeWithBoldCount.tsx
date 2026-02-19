import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface PluralizeWithBoldCountProps {
  readonly count: number;
  readonly singular: string;
  readonly plural?: string;
}

const PluralizeWithBoldCount: FC<PluralizeWithBoldCountProps> = ({
  count,
  singular,
  plural,
}) => (
  <>
    <strong>{count.toLocaleString()}</strong>{" "}
    {pluralize(count, singular, plural)}
  </>
);

export default PluralizeWithBoldCount;
