import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import type { WslProfile } from "../../types";

const WslProfileNonCompliantInstancesList = lazy(
  () => import("../WslProfileNonCompliantInstancesList"),
);

interface WslProfileNonCompliantParentsLinkProps {
  readonly wslProfile: WslProfile;
}

const WslProfileNonCompliantParentsLink: FC<
  WslProfileNonCompliantParentsLinkProps
> = ({ wslProfile }) => {
  const { setSidePanelContent } = useSidePanel();

  if (!wslProfile.tags.length && !wslProfile.all_computers) {
    return <NoData />;
  }

  if (!wslProfile.computers["non-compliant"].length) {
    return "0 instances";
  }

  const openNonCompliantInstancesList = () => {
    setSidePanelContent(
      `Instances not compliant with ${wslProfile.title}`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileNonCompliantInstancesList />
      </Suspense>,
      "large",
    );
  };

  return (
    <Button
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
