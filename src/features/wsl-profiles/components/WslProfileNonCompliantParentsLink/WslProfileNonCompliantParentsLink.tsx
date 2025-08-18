import NoData from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { type FC } from "react";
import type { WslProfile } from "../../types";

interface WslProfileNonCompliantParentsLinkProps {
  readonly wslProfile: WslProfile;
  readonly onClick: () => void;
}

const WslProfileNonCompliantParentsLink: FC<
  WslProfileNonCompliantParentsLinkProps
> = ({ wslProfile, onClick: openNonCompliantInstancesList }) => {
  if (!wslProfile.tags.length && !wslProfile.all_computers) {
    return <NoData />;
  }

  if (!wslProfile.computers["non-compliant"].length) {
    return "0 instances";
  }

  return (
    <Button
      className="u-no-padding--top u-no-margin--bottom"
      type="button"
      appearance="link"
      onClick={openNonCompliantInstancesList}
    >
      {wslProfile.computers["non-compliant"].length}{" "}
      {pluralize(wslProfile.computers["non-compliant"].length, "instance")}
    </Button>
  );
};

export default WslProfileNonCompliantParentsLink;
