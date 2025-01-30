import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const NewDistributionForm = lazy(() => import("../NewDistributionForm"));

const DistributionsEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreateDistribution = () => {
    setSidePanelContent(
      "Add distribution",
      <Suspense fallback={<LoadingState />}>
        <NewDistributionForm />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      title="No mirrors have been added yet"
      icon="containers"
      body={
        <>
          <p className="u-no-margin--bottom">
            To add a new mirror you must first add a distribution
          </p>
          <a
            href="https://ubuntu.com/landscape/docs/repositories"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage repositories in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          key="add-distribution"
          onClick={handleCreateDistribution}
          type="button"
        >
          Add distribution
        </Button>,
      ]}
    />
  );
};

export default DistributionsEmptyState;
