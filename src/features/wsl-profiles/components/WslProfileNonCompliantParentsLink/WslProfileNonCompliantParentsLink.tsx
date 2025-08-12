import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { type FC } from "react";
import type { WslProfile } from "../../types";

interface WslProfileNonCompliantParentsLinkProps {
  readonly wslProfile: WslProfile;
}

const WslProfileNonCompliantParentsLink: FC<
  WslProfileNonCompliantParentsLinkProps
> = ({ wslProfile }) => {
  const { setPageParams } = usePageParams();

  if (!wslProfile.tags.length && !wslProfile.all_computers) {
    return <NoData />;
  }

  if (!wslProfile.computers["non-compliant"].length) {
    return "0 instances";
  }

  const openNonCompliantInstancesList = () => {
    setPageParams({ action: "noncompliant", wslProfile: wslProfile.name });
  };

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
