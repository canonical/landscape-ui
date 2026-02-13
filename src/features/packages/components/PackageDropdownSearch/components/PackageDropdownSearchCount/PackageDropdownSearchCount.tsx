import { pluralizeWithCount } from "@/utils/_helpers";
import type { FC } from "react";

interface PackageDropdownSearchCountProps {
  readonly count?: number;
}

const PackageDropdownSearchCount: FC<PackageDropdownSearchCountProps> = ({
  count,
}) => {
  if (count) {
    return (
      <span className="u-text--muted">
        {pluralizeWithCount(count, "package")}
      </span>
    );
  }
};

export default PackageDropdownSearchCount;
