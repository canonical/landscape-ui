import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import { FC, lazy, Suspense } from "react";
import { Distribution, Pocket, Series } from "../../types";

const PackageList = lazy(() => import("../PackageList"));

interface SeriesPocketDetailsButtonProps {
  distributionName: Distribution["name"];
  pocket: Pocket;
  seriesName: Series["name"];
}

const SeriesPocketDetailsButton: FC<SeriesPocketDetailsButtonProps> = ({
  distributionName,
  pocket,
  seriesName,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleListPocket = () => {
    setSidePanelContent(
      `${seriesName} ${pocket.name}`,
      <Suspense fallback={<LoadingState />}>
        <PackageList
          distributionName={distributionName}
          pocket={pocket as Pocket}
          seriesName={seriesName}
        />
      </Suspense>,
    );
  };

  return (
    <>
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top"
        onClick={handleListPocket}
        aria-label={`List ${pocket.name} pocket of ${distributionName}/${seriesName}`}
      >
        {pocket.name}
      </Button>
      {pocket.mode === "pull" && (
        <p className="p-text--small u-text--muted u-no-margin--bottom">{`pulling from ${pocket.pull_pocket}`}</p>
      )}
    </>
  );
};

export default SeriesPocketDetailsButton;
